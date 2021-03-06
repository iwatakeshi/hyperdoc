// external dependencies
import { Schema, Validator, ValidatorResult } from "jsonschema";

// models
import { Mapping, MappingProperties } from "../model/Mapping";

// model schemas
import { UUIDSchema } from "./schemas/CommonSchema";
import { AuditSchema } from "./schemas/AuditSchema";
import { NodeSchema, NodePropertiesSchema, NodePropertySchema } from "./schemas/NodeSchema";
import {
  MappingSchema,
  MappingNameSchema,
  MappingPropertiesSchema,
  MappingPropertySchema
} from "./schemas/MappingSchema";

import { MappingSchemaGenerator } from "./MappingSchemaGenerator";
import { NodeProperties } from "../model/Node";

/**
 * Schema validator.
 */
export class SchemaValidator {
  /**
   * Get a validator for the model schema.
   *
   * @returns JSON schema validator
   */
  public static getModelValidator(): Validator {
    // create validator with custom node schema
    const validator = new Validator();

    validator.addSchema(UUIDSchema, UUIDSchema.id);

    validator.addSchema(AuditSchema, AuditSchema.id);

    validator.addSchema(NodeSchema, NodeSchema.id);
    validator.addSchema(NodePropertiesSchema, NodePropertiesSchema.id);
    validator.addSchema(NodePropertySchema, NodePropertySchema.id);

    validator.addSchema(MappingSchema, MappingSchema.id);
    validator.addSchema(MappingNameSchema, MappingNameSchema.id);
    validator.addSchema(MappingPropertiesSchema, MappingPropertiesSchema.id);
    validator.addSchema(MappingPropertySchema, MappingPropertySchema.id);

    return validator;
  }

  /**
   * Validate node properties.
   *
   * @param properties Node properties
   */
  public static validateNodeProperties(nodeProperties: NodeProperties, mapping?: Mapping): ValidatorResult {
    if (!mapping) {
      return this.getModelValidator().validate(nodeProperties, NodePropertiesSchema);
    } else {
      const nodePropertiesSchema = MappingSchemaGenerator.toNodePropertiesSchema(mapping);
      const validator = this.getModelValidator();

      validator.addSchema(nodePropertiesSchema, NodePropertiesSchema.id);

      return validator.validate(nodeProperties, nodePropertiesSchema);
    }
  }

  /**
   * Validate mapping name.
   *
   * @param name Mapping name
   */
  public static validateMappingName(name: string): ValidatorResult {
    return this.getModelValidator().validate(name, MappingNameSchema);
  }

  /**
   * Validate mapping properties.
   *
   * @param properties Mapping properties
   */
  public static validateMappingProperties(properties: MappingProperties): ValidatorResult {
    return this.getModelValidator().validate(properties, MappingPropertiesSchema);
  }
}
