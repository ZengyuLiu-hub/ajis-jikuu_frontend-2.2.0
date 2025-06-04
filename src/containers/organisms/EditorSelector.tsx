import { EditorSelector as Component } from '../../components/organisms/EditorSelector';

interface Props {
  selectorRef: any;
  id: string;
}

export const EditorSelector = (props: Props) => {
  return <Component {...props} />;
};
