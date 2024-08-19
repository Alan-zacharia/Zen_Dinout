export const prepareFromidableData = (data: any) => {
    const preparedData: any = {};
    Object.keys(data).forEach((key) => {
      preparedData[key] = Array.isArray(data[key])
        ? data[key].length > 1
          ? data[key]
          : data[key][0]
        : data[key];
    });
    return preparedData;
  };
  