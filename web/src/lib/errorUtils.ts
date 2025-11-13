/**
 * Utility functions for handling errors from the backend
 */

export function extractErrorMessage(error: any, defaultMessage: string = 'An error occurred'): string {
  if (error.message) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else if (error && typeof error === 'object') {
    // Handle Zod validation errors or other object errors
    if (error.formErrors && error.formErrors.length > 0) {
      return error.formErrors.join(', ');
    } else if (error.fieldErrors) {
      const fieldErrors = Object.entries(error.fieldErrors)
        .map(([field, errors]: [string, any]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
        .join('; ');
      return fieldErrors || 'Validation failed';
    } else if (error.error) {
      // If it's a nested error object
      if (typeof error.error === 'string') {
        return error.error;
      } else if (error.error.formErrors && error.error.formErrors.length > 0) {
        return error.error.formErrors.join(', ');
      } else if (error.error.fieldErrors) {
        const fieldErrors = Object.entries(error.error.fieldErrors)
          .map(([field, errors]: [string, any]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
          .join('; ');
        return fieldErrors || 'Validation failed';
      }
    }
  }
  return defaultMessage;
}

/**
 * Handles API response errors and extracts meaningful error messages
 */
export async function handleApiError(response: Response, defaultMessage: string = 'Request failed'): Promise<never> {
  let errorMessage = defaultMessage;
  
  try {
    const errorData = await response.json();
    errorMessage = extractErrorMessage(errorData, defaultMessage);
  } catch {
    // If we can't parse the response as JSON, use the status text or default message
    errorMessage = response.statusText || defaultMessage;
  }
  
  throw new Error(errorMessage);
}
