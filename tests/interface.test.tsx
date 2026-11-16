import { SiteHeader } from "@/components/layout/site-header";
import { DEMO_ACCOUNTS, RoleGate, SESSION_KEY, SessionProvider } from "@/lib/auth/session";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  usePathname: () => "/repair",
}));

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("responsive navigation", () => {
  it("opens the mobile menu and keeps primary links available", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "How It Works" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "For Repair Centres" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Pricing" })).toBeInTheDocument();
    const button = screen.getByRole("button", { name: "Open menu" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("navigation", { name: "Mobile" })).toBeInTheDocument();
  });
});

describe("role gate", () => {
  it("hides a repair workspace from the dealer demo", async () => {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(DEMO_ACCOUNTS[1]));
    render(
      <SessionProvider>
        <RoleGate area="repair">
          <p>Secret bench</p>
        </RoleGate>
      </SessionProvider>,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Checking demo session");
    await waitFor(() => {
      expect(screen.queryByText("Secret bench")).not.toBeInTheDocument();
    });
  });

  it("shows the repair workspace to the technician demo", async () => {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(DEMO_ACCOUNTS[0]));
    render(
      <SessionProvider>
        <RoleGate area="repair">
          <p>Secret bench</p>
        </RoleGate>
      </SessionProvider>,
    );
    expect(await screen.findByText("Secret bench")).toBeInTheDocument();
  });
});
