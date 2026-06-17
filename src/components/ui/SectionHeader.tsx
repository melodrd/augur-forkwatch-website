type SectionHeaderProps = {
  description?: string;
  eyebrow: string;
  id: string;
  title: string;
};

export function SectionHeader({
  description,
  eyebrow,
  id,
  title,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-display text-xl uppercase leading-none text-muted-foreground">
          &gt;_ {eyebrow}
        </p>
        <h2
          className="mt-2 font-display text-4xl uppercase leading-none text-foreground"
          id={id}
        >
          {title}
        </h2>
      </div>
      {description ? (
        <p className="max-w-xl text-sm leading-6 text-foreground/80">
          {description}
        </p>
      ) : null}
    </div>
  );
}
