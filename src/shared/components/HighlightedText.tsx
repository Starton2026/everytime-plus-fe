import { Fragment } from "react";
import { splitByKeyword } from "@/shared/lib/textHighlight";

interface HighlightedTextProps {
  text: string;
  keyword?: string;
}

/** 검색 결과에서 키워드를 <mark>로 감싼다. */
export function HighlightedText({ text, keyword }: HighlightedTextProps) {
  if (!keyword?.trim()) return <>{text}</>;

  return (
    <>
      {splitByKeyword(text, keyword).map((segment, index) => (
        <Fragment key={`${segment.text}-${index}`}>
          {segment.matched ? <mark>{segment.text}</mark> : segment.text}
        </Fragment>
      ))}
    </>
  );
}
