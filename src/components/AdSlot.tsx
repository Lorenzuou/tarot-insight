interface AdSlotProps {
  width: string;
  height: string;
  position?: "top" | "sidebar" | "bottom";
}

const AdSlot = ({ width, height, position = "top" }: AdSlotProps) => {
  return (
    <div
      style={{ width, height }}
      className="flex items-center justify-center border border-border bg-card/50 backdrop-blur-sm rounded-lg"
    >
      <div className="text-center text-muted-foreground text-sm">
        <div className="text-xs opacity-50 mb-1">Espaço Publicitário</div>
        <div className="text-xs opacity-30">{width} × {height}</div>
        <div className="text-xs opacity-20 mt-1">{position}</div>
      </div>
    </div>
  );
};

export default AdSlot;
