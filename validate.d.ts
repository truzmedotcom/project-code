export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

export declare const schema: Record<string, unknown>;

// Checks a parsed document against the schema, then the rules the schema can't express: unique ids per list, and
// every reference pointing at an id that exists.
export declare function validate(document: unknown): ValidationResult;
