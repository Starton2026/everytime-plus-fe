import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { ROUTES } from "@/shared/constants/routes";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <EmptyState
        title="페이지를 찾을 수 없어요"
        description="주소가 바뀌었거나 삭제된 페이지일 수 있어요."
        action={
          <Button onClick={() => navigate(ROUTES.boardList, { replace: true })}>
            게시판으로 가기
          </Button>
        }
      />
    </div>
  );
}
