export const Button = ({ children, variant = 'primary', ...props }) => {
  const styles = {
    primary: "bg-[#50C878] text-white hover:bg-[#45b36b]",
    secondary: "bg-white text-[#50C878] border-2 border-[#50C878] hover:bg-gray-50",
    outline: "bg-transparent text-gray-500 hover:text-gray-700"
  };

  return (
    <button 
      className={`h-14 w-full rounded-xl font-bold text-xl shadow-sm transition-all active:scale-95 ${styles[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};