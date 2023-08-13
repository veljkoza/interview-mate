const hoverStyles = "hover:opacity-50";

const VARIANTS = {
  active: `border-accent-secondary bg-accent-secondary text-black ${hoverStyles}`,
  default: `border-white text-white ${hoverStyles}`,
  inactive: "border-muted-fg text-muted-fg",
};

export const SelectOption = (props: {
  variant: "active" | "default" | "inactive";
  text: string | number;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) => {
  const { onClick, text, variant, className = "", disabled = false } = props;
  const isDisabled = disabled;
  return (
    <button
      onClick={() => onClick?.()}
      disabled={isDisabled}
      className={`border  px-10 py-5 ${VARIANTS[variant]} ${className}`}
    >
      {text}
    </button>
  );
};

const widths = ["w-16", "w-24", "w-32", "w-28"];

const getRandomWidth = () => widths[Math.floor(Math.random() * widths.length)];

export const SelectOptionGhost = () => {
  return (
    <button
      className={`w-  border px-10 py-7 ${VARIANTS["inactive"]} relative animate-pulse`}
    >
      <span
        className={` block h-1 ${getRandomWidth() || ""} bg-muted-fg`}
      ></span>
      <div className="absolute inset-0 blur-xl"></div>
    </button>
  );
};
SelectOption.Ghost = SelectOptionGhost;

export const FocusedOption = ({
  item,
  activeItem,
  onClick,
  className,
}: {
  item: string | number;
  activeItem: string | number;
  className?: string;
  onClick: (item: string | number) => void;
}) => {
  const isActive = activeItem === item;
  const getVariant = () => {
    if (!activeItem) return "default";
    if (activeItem === item) return "active";
    return "inactive";
  };
  return (
    <SelectOption
      onClick={() => onClick(item)}
      text={item}
      className={className}
      variant={getVariant()}
    />
  );
};
