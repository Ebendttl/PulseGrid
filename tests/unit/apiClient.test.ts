import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiClient } from "@/lib/apiClient";
import AxiosMockAdapter from "axios-mock-adapter";

describe("apiClient Interceptors", () => {
  let mock: InstanceType<typeof AxiosMockAdapter>;

  beforeEach(() => {
    mock = new AxiosMockAdapter(apiClient);
    localStorage.clear();
  });

  afterEach(() => {
    mock.restore();
  });

  it("attaches Authorization header if token is stored in localStorage", async () => {
    localStorage.setItem("pg_auth_token", "test-token-123");
    mock.onGet("/test").reply((config) => {
      expect(config.headers?.Authorization).toBe("Bearer test-token-123");
      return [200, { success: true }];
    });

    const response = await apiClient.get("/test");
    expect(response.status).toBe(200);
  });

  it("passes through 200 responses", async () => {
    mock.onGet("/ok").reply(200, { data: "ok" });
    const res = await apiClient.get("/ok");
    expect(res.data).toEqual({ data: "ok" });
  });

  it("handles 401 response interceptor in browser environment", async () => {
    const assignMock = vi.fn();
    Object.defineProperty(window, "location", {
      writable: true,
      value: {
        pathname: "/dashboard",
        assign: assignMock,
      },
    });

    mock.onGet("/unauth").reply(401);

    try {
      await apiClient.get("/unauth");
    } catch {
      // Expected rejection
    }

    expect(assignMock).toHaveBeenCalledWith(
      "/login?redirect=%2Fdashboard"
    );
  });
});
