import { boolean, object } from 'yup';

import { authApiClient } from 'shared/api/apiConfig';
import { IntegrationTypes } from 'shared/consts';

export const createProlificIntegration = async (apiToken: string, appletId?: string) => {
  try {
    await authApiClient.post('/integrations/', {
      integrationType: IntegrationTypes.Prolific,
      appletId,
      configuration: {
        api_key: apiToken,
      },
    });
  } catch (e) {
    throw new Error('Invalid Prolific API Token');
  }
};

const ProlificIntegrationStatus = object({
  exists: boolean().required(),
});

export const getProlificApiToken = async (appletId: string): Promise<boolean> => {
  const response = await authApiClient.get('/integrations/prolific', {
    params: { applet_id: appletId },
  });

  if (response.status === 200) {
    const prolificIntegrationStatus = await ProlificIntegrationStatus.validate(response.data);

    return prolificIntegrationStatus.exists;
  }

  return false;
};
