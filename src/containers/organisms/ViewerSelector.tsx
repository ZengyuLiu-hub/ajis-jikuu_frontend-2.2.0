import { ViewerSelector as Component } from '../../components/organisms';

interface Props {
  selectorRef: any;
  id: string;
}

/**
 * マップビューア：セレクター
 */
export const ViewerSelector = (props: Props) => {
  return <Component {...props} />;
};
