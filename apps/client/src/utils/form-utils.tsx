import {
  standardSchemaValidator,
  type ValidationError,
} from "@tanstack/react-form";

export function formatFormErrors(errors: ValidationError[]) {
  if (errors.length > 0 && typeof errors[0] === "string") {
    return <em>{errors[0]}</em>;
  } else return null;
}
export const formErrorsSchema = standardSchemaValidator({
  transformErrors: (errors) => {
    if (!errors.length) return;
    return errors?.[0]?.message;
  },
});
