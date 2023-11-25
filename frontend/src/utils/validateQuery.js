// Function to validate the query
export const validateQuery = async (body, validationError) => {
  //body must have combinator and rules
  if (!body.combinator || !body.rules) {
    validationError("Query must have combinator and rules");
    return true;
  }

  if (body.rules.length == 0) {
    validationError("Query must have atleast one rule");
    return true;
  }

  let countTimestampGreaterThan = 0;
  let countTimestampLessThan = 0;

  //for field = level, resourceId, message, traceId, spanId, commit the operator must be =, contains, beginWith, endsWith
  //for above fields every value must be ateast of length 3
  //for field = timestamp the operator must be <, >
  //for field = timestamp the value must be a valid timestamp

  for (let i = 0; i < body.rules.length; i++) {
    let rule = body.rules[i];
    let field = rule.field;
    let operator = rule.operator;
    let value = rule.value;

    if (field == "timestamp") {
      if (operator != "<" && operator != ">") {
        validationError("Invalid operator for field timestamp");
        return true;
      }

      if (operator == "<") {
        countTimestampLessThan++;
      }
      if (operator == ">") {
        countTimestampGreaterThan++;
      }

      if (value.length < 1) {
        validationError("Invalid value for field timestamp");
        return true;
      }

      //validate time stamp 2023-09-15T08:00:00Z
      const date = new Date(value);

      if (isNaN(date.getTime())) {
        validationError("Invalid value for field timestamp");
        return true;
      }
    } else {
      if (
        operator != "=" &&
        operator != "contains" &&
        operator != "endsWith" &&
        operator != "beginsWith" &&
        operator != "regex"
      ) {
        validationError("Invalid operator for field " + field);
        return true;
      }
      if (operator != "regex") {
        if (value.length < 2) {
          validationError("The value must be atleast 2 for field " + field);
          return true;
        }
      }

      //if operator is contains being with ends with then value must not have hyphen
      if (
        operator == "contains" ||
        operator == "endsWith" ||
        operator == "beginsWith" ||
        operator == "regex"
      ) {
        if (value.includes("-")) {
          validationError(
            "Hyphen is not supported in value fo regular expression search. Please remove hyphen for field " +
              field +
              " and Try again"
          );
          return true;
        }
      }
    }
  }

  if (countTimestampGreaterThan > 1 || countTimestampLessThan > 1) {
    validationError(
      "Only one greater than and one less than operator are allowed for time stamp. Please remove additional timestamp filters and Try again"
    );
    return true;
  }

  return false;
};
