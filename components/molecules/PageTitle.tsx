"use client";

const PageTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => {
  return (
    <>
      <h1 className="text-3xl font-bold text-foreground font-primary">
        {title}
      </h1>
      <p className="text-muted-foreground font-secondary">{subtitle}</p>
    </>
  );
};
export default PageTitle;
