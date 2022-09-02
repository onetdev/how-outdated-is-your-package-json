import { ComponentProps, FunctionComponent, PropsWithChildren } from "react";
import { clsx } from "clsx";

import styles from "@/components/atoms/Button.module.css";

type ButtonProps = PropsWithChildren<
  {
    variant?: "primary" | "secondary";
    size?: "normal";
  } & ComponentProps<"button">
>;
const Button: FunctionComponent<ButtonProps> = ({
  children,
  variant = "primary",
  size = "normal",
  className = "",
  ...props
}) => {
  const classes = clsx(
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    className
  );

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
