import { motion } from 'framer-motion'

const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  type = 'button',
  disabled = false,
  className = '',
  icon,
  ...props 
}) => {
  const baseClass = 'btn'
  const variantClass = variant === 'secondary' ? 'btn-secondary' : ''

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${variantClass} ${className}`}
      {...props}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </motion.button>
  )
}

export default Button
