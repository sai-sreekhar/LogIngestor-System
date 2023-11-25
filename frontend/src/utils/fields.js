const operators = [
  {
    name: "=",
    label: "=",
  },
  {
    name: "contains",
    label: "contains",
  },
  {
    name: "beginsWith",
    label: "begins With",
  },
  {
    name: "endsWith",
    label: "ends With",
  },
  {
    name: "regex",
    label: "Regex",
  }
];

const timestampOperators = [
  {
    name: "<",
    label: "<",
  },
  {
    name: ">",
    label: ">",
  },
];

export const fields = [
  {
    name: "level",
    label: "Level",
    placeholder: "Enter Log Level",
    operators: operators,
  },
  {
    name: "message",
    label: "Message",
    placeholder: "Enter Log Message",
    operators: operators,
  },
  {
    name: "resourceId",
    label: "Resource Id",
    placeholder: "Enter Log Resource Id",
    operators: operators,
  },
  {
    name: "timestamp",
    label: "Timestamp",
    placeholder: "Enter Log Timestamp",
    inputType: "datetime-local",
    operators: timestampOperators,
  },
  {
    name: "traceId",
    label: "Trace Id",
    placeholder: "Enter Log Trace Id",
    operators: operators,
  },
  {
    name: "spanId",
    label: "Span Id",
    placeholder: "Enter Log Span Id",
    operators: operators,
  },
  {
    name: "commit",
    label: "Commit",
    placeholder: "Enter Log Commit",
    operators: operators,
  },
  {
    name: "metadata.parentResourceId",
    label: "Parent Resource Id",
    placeholder: "Enter Log Metadata Parent Resource Id",
    operators: operators,
  },
];
