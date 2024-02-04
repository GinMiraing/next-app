"use client";

const Markdown: React.FC<{
  text: string;
}> = ({ text }) => {
  return (
    <div
      className="markdown"
      dangerouslySetInnerHTML={{ __html: text }}
    ></div>
  );
};

export default Markdown;
