// Button.jsx - Composant bouton réutilisable
export function Button({ children, onClick, variant = 'primary', disabled = false, className = '', ...props }) {
  const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
  
  const variants = {
    primary: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg',
    secondary: 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white shadow-lg',
    success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg',
    danger: 'bg-gradient-to-r from-blood-red to-red-900 hover:from-red-900 hover:to-black text-white shadow-lg',
    outline: 'border-2 border-white text-white hover:bg-white hover:text-dark-blue',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
