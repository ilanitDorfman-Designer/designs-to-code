/** Default privacy mask length shown when `EtNumber` has `isMasked`. */
export const ET_NUMBER_DEFAULT_MASK_LENGTH = 7;

/**
 * Resolves the text shown when `isMasked` is true.
 * `maskLength` controls how many asterisks are rendered.
 */
export function resolveEtNumberMaskedText(maskLength = ET_NUMBER_DEFAULT_MASK_LENGTH): string {
  if (maskLength !== undefined && Number.isFinite(maskLength) && maskLength > 0) {
    return '*'.repeat(Math.floor(maskLength));
  }
  return '*'.repeat(ET_NUMBER_DEFAULT_MASK_LENGTH);
}
