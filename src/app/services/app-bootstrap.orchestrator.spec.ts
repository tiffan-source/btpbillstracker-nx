import { TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GetAllUserClientsUseCase } from "@btpbilltracker/clients";
import { ClientStore } from "../stores/client.store";
import { AppBootstrapOrchestrator } from "./app-bootstrap.orchestrator";

interface TestClient {
  id: string;
  name: string;
}

type ExecuteResult =
  | { success: true; data: TestClient[] }
  | { success: false; data: TestClient[] };

const flushPromises = async (): Promise<void> => {
  await Promise.resolve();
  await Promise.resolve();
};

describe("AppBootstrapOrchestrator", () => {
  let executeMock: ReturnType<typeof vi.fn<() => Promise<ExecuteResult>>>;
  let setClientsMock: ReturnType<typeof vi.fn<(clients: TestClient[]) => void>>;

  beforeEach(() => {
    executeMock = vi.fn<() => Promise<ExecuteResult>>();
    setClientsMock = vi.fn<(clients: TestClient[]) => void>();

    TestBed.configureTestingModule({
      providers: [
        AppBootstrapOrchestrator,
        {
          provide: GetAllUserClientsUseCase,
          useValue: { execute: executeMock },
        },
        {
          provide: ClientStore,
          useValue: { setClients: setClientsMock },
        },
      ],
    });
  });

  it("does not run bootstrap before trigger()", () => {
    TestBed.inject(AppBootstrapOrchestrator);

    expect(executeMock).not.toHaveBeenCalled();
    expect(setClientsMock).not.toHaveBeenCalled();
  });

  it("loads clients and stores them when execute() succeeds", async () => {
    const clients: TestClient[] = [{ id: "1", name: "Acme" }];
    executeMock.mockResolvedValue({ success: true, data: clients });

    const orchestrator = TestBed.inject(AppBootstrapOrchestrator);
    orchestrator.trigger();
    await flushPromises();

    expect(executeMock).toHaveBeenCalledTimes(1);
    expect(setClientsMock).toHaveBeenCalledTimes(1);
    expect(setClientsMock).toHaveBeenCalledWith(clients);
  });

  it("stores an empty array when execute() fails", async () => {
    executeMock.mockResolvedValue({
      success: false,
      data: [{ id: "x", name: "Should be ignored" }],
    });

    const orchestrator = TestBed.inject(AppBootstrapOrchestrator);
    orchestrator.trigger();
    await flushPromises();

    expect(executeMock).toHaveBeenCalledTimes(1);
    expect(setClientsMock).toHaveBeenCalledTimes(1);
    expect(setClientsMock).toHaveBeenCalledWith([]);
  });

  it("runs bootstrap only once even if trigger() is called multiple times", async () => {
    executeMock.mockResolvedValue({ success: true, data: [] });

    const orchestrator = TestBed.inject(AppBootstrapOrchestrator);
    orchestrator.trigger();
    orchestrator.trigger();
    orchestrator.trigger();
    await flushPromises();

    expect(executeMock).toHaveBeenCalledTimes(1);
    expect(setClientsMock).toHaveBeenCalledTimes(1);
  });
});