"use client";

const Markdown: React.FC<{
  text: string;
}> = ({ text }) => {
  return (
    <div
      className="markdown space-y-4"
      dangerouslySetInnerHTML={{ __html: text }}
    ></div>
  );
};

export default Markdown;
