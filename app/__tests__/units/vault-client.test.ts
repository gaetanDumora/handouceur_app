import { usePgRole } from "@/clients";

describe("vault-client", () => {
  it("should throw if role not exist", async () => {
    expect(async () => await usePgRole("rrr" as "ro")).rejects.toThrow();
  });
});
