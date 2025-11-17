import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'subtle' | 'medium' | 'strong';
  hoverable?: boolean;
  animated?: boolean;
  glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = 'medium',
  hoverable = false,
  animated = true,
  glow = false,
}) => {
  const baseClasses = 'relative backdrop-blur-sm border border-white/10 dark:border-white/5';
  
  const variantClasses = {
    subtle: 'bg-glass-light dark:bg-glass-dark-light',
    medium: 'bg-glass-medium dark:bg-glass-dark-medium',
    strong: 'bg-glass-strong dark:bg-glass-dark-strong',
  };

  const shadowClasses = glow 
    ? 'shadow-glow' 
    : variant === 'strong' 
      ? 'shadow-glass-lg' 
      : 'shadow-glass';

  const Component = animated ? motion.div : 'div';
  
  const animationProps = animated ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut" },
    whileHover: hoverable ? { 
      y: -2, 
      transition: { duration: 0.2 } 
    } : undefined,
  } : {};

  return (
    <Component
      className={clsx(
        baseClasses,
        variantClasses[variant],
        shadowClasses,
        hoverable && 'hover:border-white/20 dark:hover:border-white/10 transition-all duration-300',
        className
      )}
      {...animationProps}
    >
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent dark:from-white/3 pointer-events-none rounded-[inherit]" />
      
      {/* Inner highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </Component>
  );
};

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  glow?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  glow = false,
  disabled,
  ...props
}) => {
  const baseClasses = 'relative font-medium transition-all duration-200 backdrop-blur-sm border rounded-lg overflow-hidden';
  
  const variantClasses = {
    primary: 'bg-primary-500/20 hover:bg-primary-500/30 border-primary-400/30 text-primary-100 hover:text-white',
    secondary: 'bg-glass-medium hover:bg-glass-strong border-white/20 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
    ghost: 'bg-transparent hover:bg-glass-light border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
    danger: 'bg-red-500/20 hover:bg-red-500/30 border-red-400/30 text-red-100 hover:text-white',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const glowClasses = glow && variant === 'primary' ? 'animate-glow' : '';

  return (
    <motion.button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        glowClasses,
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      whileHover={(disabled || loading) ? {} : { scale: 1.02 }}
      whileTap={(disabled || loading) ? {} : { scale: 0.98 }}
      transition={{ duration: 0.1 }}
      onClick={props.onClick}
      type={props.type}
      form={props.form}
      name={props.name}
      value={props.value}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] animate-shimmer" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center space-x-2">
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        <span>{children}</span>
      </div>
    </motion.button>
  );
};

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const GlassInput: React.FC<GlassInputProps> = ({
  className,
  label,
  error,
  icon,
  ...props
}) => {
  return (
    <motion.div 
      className="space-y-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={clsx(
            'w-full py-2 rounded-lg backdrop-blur-sm transition-all duration-200',
            'bg-glass-medium dark:bg-glass-dark-medium',
            'border border-white/20 dark:border-white/10',
            'text-gray-900 dark:text-gray-100',
            'placeholder-gray-500 dark:placeholder-gray-400',
            'focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400/50',
            'hover:border-white/30 dark:hover:border-white/20',
            icon ? 'pl-10 pr-4' : 'px-4',
            error && 'border-red-400/50 focus:ring-red-500/30',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <motion.p 
          className="text-sm text-red-400"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1,
  className,
}) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const start = 0;
    const end = value;
    const increment = (end - start) / (duration * 60); // 60fps
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {displayValue}
    </motion.span>
  );
};

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  delay = 0,
  className,
}) => {
  return (
    <motion.div
      className={clsx('animate-float', className)}
      style={{ animationDelay: `${delay}s` }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};
