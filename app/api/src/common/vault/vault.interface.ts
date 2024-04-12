export const DB_ROLES = { RO: 'ro', DEFAULT: 'rwd' } as const;

export type DatabaseRoles = (typeof DB_ROLES)[keyof typeof DB_ROLES];
interface BaseResponse {
  auth: string | null;
  lease_duration: number;
  lease_id: string;
  mount_type: string;
  renewable: boolean;
  request_id: string;
  warnings: string;
  wrap_info: string;
}
export type LoginResponse = {
  auth: {
    client_token: string;
    accessor: string;
    policies: string[];
    token_policies: string[];
    metadata: Record<string, unknown>;
    lease_duration: number;
    renewable: boolean;
    entity_id: string;
    token_type: string;
    orphan: boolean;
    mfa_requirement: string | null;
    num_uses: number;
  };
};
export interface KvSecret extends BaseResponse {
  data: Record<string, any>;
  metadata: {
    created_time: string;
    custom_metadata: string;
    deletion_time: string;
    destroyed: boolean;
    version: number;
  };
}
export interface DatabaseSecret extends BaseResponse {
  data: { username: string; password: string };
}

export type TokenLookup = {
  accessor: string;
  creation_time: number;
  creation_ttl: number;
  display_name: string;
  entity_id: string;
  expire_time: string;
  explicit_max_ttl: number;
  id: string;
  issue_time: string;
  meta: {
    role_name: string;
  };
  num_uses: number;
  orphan: boolean;
  path: string;
  policies: string[];
  renewable: boolean;
  ttl: number;
  type: string;
};
