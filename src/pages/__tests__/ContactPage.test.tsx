import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import ContactPage from "../ContactPage";
import { ToastProvider } from "../../context/ToastContext";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>{children}</ToastProvider>
);

describe("ContactPage", () => {
  it("renders contact form correctly", () => {
    render(
      <TestWrapper>
        <ContactPage />
      </TestWrapper>
    );

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send message/i })
    ).toBeInTheDocument();
  });

  it("shows validation errors for empty required fields", async () => {
    render(
      <TestWrapper>
        <ContactPage />
      </TestWrapper>
    );

    const submitButton = screen.getByRole("button", { name: /send message/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Full name is required")).toBeInTheDocument();
      expect(screen.getByText("Subject is required")).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Message is required")).toBeInTheDocument();
    });
  });

  it("validates email format", async () => {
    render(
      <TestWrapper>
        <ContactPage />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    const submitButton = screen.getByRole("button", { name: /send message/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email address")
      ).toBeInTheDocument();
    });
  });

  it("validates minimum character requirements", async () => {
    render(
      <TestWrapper>
        <ContactPage />
      </TestWrapper>
    );

    // Fill with too short values
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Jo" },
    });
    fireEvent.change(screen.getByLabelText(/subject/i), {
      target: { value: "Hi" },
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: "Short" },
    });

    const submitButton = screen.getByRole("button", { name: /send message/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Full name must be at least 3 characters")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Subject must be at least 3 characters")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Message must be at least 10 characters")
      ).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    render(
      <TestWrapper>
        <ContactPage />
      </TestWrapper>
    );

    // Fill form with valid data
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/subject/i), {
      target: { value: "Test Subject" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: "This is a test message with enough characters." },
    });

    const submitButton = screen.getByRole("button", { name: /send message/i });
    fireEvent.click(submitButton);

    // Should show submitting state
    await waitFor(() => {
      expect(screen.getByText("Sending...")).toBeInTheDocument();
    });
  });

  it("clears form when reset button is clicked", () => {
    render(
      <TestWrapper>
        <ContactPage />
      </TestWrapper>
    );

    // Fill form
    const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
    const subjectInput = screen.getByLabelText(/subject/i) as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(subjectInput, { target: { value: "Test Subject" } });

    expect(nameInput.value).toBe("John Doe");
    expect(subjectInput.value).toBe("Test Subject");

    // Reset form
    const resetButton = screen.getByRole("button", { name: /reset/i });
    fireEvent.click(resetButton);

    expect(nameInput.value).toBe("");
    expect(subjectInput.value).toBe("");
  });

  it("shows character count for message field", () => {
    render(
      <TestWrapper>
        <ContactPage />
      </TestWrapper>
    );

    const messageInput = screen.getByLabelText(/message/i);
    fireEvent.change(messageInput, { target: { value: "Hello" } });

    // Check for character count - use more specific selector
    expect(screen.getByText(/\/500 characters/)).toBeInTheDocument();
  });
});
