/** 실제 네트워크처럼 보이도록 약간의 지연을 준다. 로딩 UI 확인용. */
export function delay(ms = 220): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
