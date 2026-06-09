package com.dignamente.br.api.service;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestClient;

import com.dignamente.br.api.entities.Appointment;
import com.dignamente.br.api.exceptions.GoogleMeetException;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.UserCredentials;

@Service
public class GoogleMeetService {

    private static final String CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar";
    private static final DateTimeFormatter GOOGLE_DATE_TIME_FORMATTER = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

    @Value("${google.calendar.credentials-file:}")
    private String credentialsFile;

    @Value("${google.calendar.oauth.client-id:}")
    private String oauthClientId;

    @Value("${google.calendar.oauth.client-secret:}")
    private String oauthClientSecret;

    @Value("${google.calendar.oauth.refresh-token:}")
    private String oauthRefreshToken;

    @Value("${google.calendar.id:primary}")
    private String calendarId;

    @Value("${google.calendar.time-zone:America/Sao_Paulo}")
    private String timeZone;

    private final RestClient restClient = RestClient.builder()
            .baseUrl("https://www.googleapis.com/calendar/v3")
            .build();

    public GoogleMeetEvent createMeet(Appointment appointment) {
        if (credentialsFile == null || credentialsFile.isBlank()) {
            throw new GoogleMeetException("Configure google.calendar.credentials-file para gerar links do Google Meet");
        }

        try {
            String accessToken = getAccessToken();
            Map<String, Object> requestBody = buildRequestBody(appointment);

            Map<?, ?> response = restClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/calendars/{calendarId}/events")
                            .queryParam("conferenceDataVersion", "1")
                            .build(calendarId))
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            String eventId = getString(response, "id");
            String meetingLink = extractMeetingLink(response);

            if (meetingLink == null || meetingLink.isBlank()) {
                throw new GoogleMeetException("O Google Calendar não retornou um link do Meet");
            }

            return new GoogleMeetEvent(eventId, meetingLink);
        } catch (IOException ex) {
            throw new GoogleMeetException("Não foi possível ler as credenciais do Google Calendar", ex);
        } catch (RestClientResponseException ex) {
            throw new GoogleMeetException(
                    "Não foi possível criar o link do Google Meet. Google retornou "
                            + ex.getStatusCode() + ": " + ex.getResponseBodyAsString(),
                    ex);
        } catch (RuntimeException ex) {
            if (ex instanceof GoogleMeetException) {
                throw ex;
            }
            throw new GoogleMeetException("Não foi possível criar o link do Google Meet", ex);
        }
    }

    private String getAccessToken() throws IOException {
        GoogleCredentials credentials = getCredentials();

        try {
            credentials.refreshIfExpired();
            return credentials.getAccessToken().getTokenValue();
        } catch (IOException ex) {
            if (hasOauthCredentials()) {
                throw new GoogleMeetException("Não foi possível renovar o token OAuth do Google Calendar: "
                        + ex.getMessage(), ex);
            }

            throw ex;
        }
    }

    private GoogleCredentials getCredentials() throws IOException {
        if (hasOauthCredentials()) {
            return UserCredentials.newBuilder()
                    .setClientId(oauthClientId)
                    .setClientSecret(oauthClientSecret)
                    .setRefreshToken(oauthRefreshToken)
                    .build()
                    .createScoped(List.of(CALENDAR_SCOPE));
        }

        try (InputStream credentialsStream = openCredentialsStream()) {
            return GoogleCredentials
                    .fromStream(credentialsStream)
                    .createScoped(List.of(CALENDAR_SCOPE));
        }
    }

    private boolean hasOauthCredentials() {
        return oauthClientId != null && !oauthClientId.isBlank()
                && oauthClientSecret != null && !oauthClientSecret.isBlank()
                && oauthRefreshToken != null && !oauthRefreshToken.isBlank();
    }

    private InputStream openCredentialsStream() throws IOException {
        if (credentialsFile.startsWith("classpath:")) {
            String resourcePath = credentialsFile.replace("classpath:", "");
            return new ClassPathResource(resourcePath).getInputStream();
        }

        return new FileInputStream(credentialsFile);
    }

    private Map<String, Object> buildRequestBody(Appointment appointment) {
        ZoneId zoneId = ZoneId.of(timeZone);
        String start = appointment.getDateTime().atZone(zoneId).format(GOOGLE_DATE_TIME_FORMATTER);
        String end = appointment.getDateTime().plusMinutes(50).atZone(zoneId).format(GOOGLE_DATE_TIME_FORMATTER);

        return Map.of(
                "summary", "Consulta DignaMente",
                "description", "Consulta entre " + appointment.getPatient().getName()
                        + " e " + appointment.getPsychologist().getName(),
                "start", Map.of(
                        "dateTime", start,
                        "timeZone", timeZone),
                "end", Map.of(
                        "dateTime", end,
                        "timeZone", timeZone),
                "conferenceData", Map.of(
                        "createRequest", Map.of(
                                "requestId", UUID.randomUUID().toString(),
                                "conferenceSolutionKey", Map.of("type", "hangoutsMeet"))));
    }

    private String extractMeetingLink(Map<?, ?> response) {
        String hangoutLink = getString(response, "hangoutLink");
        if (hangoutLink != null) {
            return hangoutLink;
        }

        Object conferenceData = response.get("conferenceData");
        if (!(conferenceData instanceof Map<?, ?> conferenceDataMap)) {
            return null;
        }

        Object entryPoints = conferenceDataMap.get("entryPoints");
        if (!(entryPoints instanceof List<?> entryPointList)) {
            return null;
        }

        return entryPointList.stream()
                .filter(Map.class::isInstance)
                .map(Map.class::cast)
                .filter(entryPoint -> "video".equals(entryPoint.get("entryPointType")))
                .map(entryPoint -> getString(entryPoint, "uri"))
                .filter(uri -> uri != null && !uri.isBlank())
                .findFirst()
                .orElse(null);
    }

    private String getString(Map<?, ?> map, String key) {
        if (map == null) {
            return null;
        }

        Object value = map.get(key);
        return value == null ? null : value.toString();
    }

    public record GoogleMeetEvent(String eventId, String meetingLink) {
    }
}
