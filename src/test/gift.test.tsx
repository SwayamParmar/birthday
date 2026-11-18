import { act, fireEvent, render, screen } from "@testing-library/react";
import { gift } from "@/config/gift";
import { PinLock } from "@/scenes/PinLock";
import { STEPS } from "@/steps";

describe("gift config", () => {
  it("has the content the flow needs", () => {
    expect(gift.name.trim()).not.toBe("");
    expect(gift.sender.trim()).not.toBe("");
    expect(gift.pin).toMatch(/^\d{4}$/);
    expect(gift.reasons).toHaveLength(5);
    expect(gift.letter.body.trim()).not.toBe("");
  });

  it("runs steps 1-8 and 10 in order (no video step)", () => {
    expect(STEPS).toEqual(["pin", "bow", "title", "tree", "cake", "balloons", "memories", "letter", "finale"]);
  });
});

describe("PinLock", () => {
  const typeCode = (code: string) =>
    code.split("").forEach((d, i) => fireEvent.change(screen.getByLabelText(`Digit ${i + 1}`), { target: { value: d } }));

  it("unlocks with the configured PIN", () => {
    vi.useFakeTimers();
    const onUnlock = vi.fn();
    render(<PinLock onUnlock={onUnlock} />);
    typeCode(gift.pin);
    fireEvent.click(screen.getByRole("button", { name: "Unwrap" }));
    expect(screen.getByText("Unwrapping…")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1200));
    expect(onUnlock).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });

  it("rejects a wrong PIN", () => {
    const onUnlock = vi.fn();
    render(<PinLock onUnlock={onUnlock} />);
    const wrong = gift.pin === "0000" ? "1111" : "0000";
    typeCode(wrong);
    fireEvent.click(screen.getByRole("button", { name: "Unwrap" }));
    expect(screen.getByText("Not quite. Try again.")).toBeInTheDocument();
    expect(onUnlock).not.toHaveBeenCalled();
  });
});
