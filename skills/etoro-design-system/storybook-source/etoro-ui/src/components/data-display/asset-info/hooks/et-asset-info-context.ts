import { createInfoContext } from '../../_info-base/context';
import type { EtAssetDefaults } from '../api/types';

const { Context: EtAssetInfoContext, useInfoContext } = createInfoContext<EtAssetDefaults>('EtAssetInfo');

export { EtAssetInfoContext };
export const useEtAssetInfoContext = useInfoContext;
