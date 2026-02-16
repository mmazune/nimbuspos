/**
 * Client ID mapping: clientOrderId -> serverOrderId
 * Stored in userData/client-map.json
 */
type ClientIdMap = Record<string, string>;
export declare function loadClientIdMap(): Promise<ClientIdMap>;
export declare function saveClientIdMap(map: ClientIdMap): Promise<void>;
export declare function addMapping(clientOrderId: string, serverOrderId: string): Promise<void>;
export declare function getServerOrderId(clientOrderId: string): Promise<string | null>;
export {};
//# sourceMappingURL=client-map.d.ts.map