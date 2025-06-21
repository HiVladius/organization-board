import {RouterProvider} from 'react-router'
import { router } from './router/index.route';

export const JiraCloneFrond = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};
