export const createFormData = <T extends Record<string, unknown>>(
  data: T,
  stringifyAll = true,
): FormData => {
  const formData = new FormData();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- safe
  if (!data) {
    return formData;
  }

  // eslint-disable-next-line array-callback-return -- safe
  Object.entries(data).map(([key, value]) => {
    if (value instanceof FileList) {
      for (const file of value) {
        formData.append(key, file);
      }
      return;
    }
    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (stringifyAll) {
      formData.append(key, JSON.stringify(value));
    } else if (typeof value === 'string') {
      formData.append(key, value);
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else {
      formData.append(key, JSON.stringify(value));
    }
  });

  return formData;
};

export const tryParseJSON = <R extends Record<string, unknown>>(
  jsonString: string,
) => {
  try {
    const json = JSON.parse(jsonString);

    return json as R;
  } catch (e) {
    return jsonString;
  }
};

export const generateFormData = (
  formData: FormData | URLSearchParams,
  preserveStringified = false,
) => {
  const outputObject: Record<any, any> = {};

  for (const [key, value] of formData.entries()) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string -- safe
    const data = preserveStringified ? value : tryParseJSON(value.toString());
    const keyParts = key.split('.');
    let currentObject = outputObject;

    for (let i = 0; i < keyParts.length - 1; i++) {
      const keyPart = keyParts[i];
      if (!currentObject[keyPart]) {
        currentObject[keyPart] = /^\d+$/.test(keyParts[i + 1]) ? [] : {};
      }
      currentObject = currentObject[keyPart];
    }

    const lastKeyPart = keyParts[keyParts.length - 1];
    const lastKeyPartIsArray = /\[\d*\]$|\[\]$/.test(lastKeyPart);

    if (lastKeyPartIsArray) {
      const key2 = lastKeyPart.replace(/\[\d*\]$|\[\]$/, '');
      if (!currentObject[key2]) {
        currentObject[key2] = [];
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- safe
      currentObject[key2].push(data);
    }

    if (!lastKeyPartIsArray) {
      if (/^\d+$/.test(lastKeyPart)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- safe
        currentObject.push(data);
      } else {
        currentObject[lastKeyPart] = data;
      }
    }
  }

  // Return the output object.
  return outputObject;
};

export const parseFormData = async <T>(
  request: Request | FormData,
  preserveStringified = false,
): Promise<T> => {
  const formData =
    request instanceof Request ? await request.formData() : request;
  return generateFormData(formData, preserveStringified);
};

export const getFormDataFromSearchParams = (
  request: Pick<Request, 'url'>,
  preserveStringified = false,
) => {
  const searchParams = new URL(request.url).searchParams;
  return generateFormData(searchParams, preserveStringified);
};
