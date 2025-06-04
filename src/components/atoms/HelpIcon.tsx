import styled from 'styled-components';

const Icon = styled.div`
  margin-left: 5px;
  background-image: url('data:image/svg+xml;base64,PHN2ZyByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjQ4cHgiIGhlaWdodD0iNDhweCIgdmlld0JveD0iMCAwIDI0IDI0IiBhcmlhLWxhYmVsbGVkYnk9ImhlbHBJY29uVGl0bGUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBmaWxsPSJub25lIiBjb2xvcj0iIzAwMCI+IDx0aXRsZSBpZD0iaGVscEljb25UaXRsZSI+SGVscDwvdGl0bGU+IDxwYXRoIGQ9Ik0xMiAxNEMxMiAxMiAxMy41NzYwMDIgMTEuNjY1Mjk4MyAxNC4xMTg2ODU4IDExLjEyMzk1MTYgMTQuNjYzMTI3IDEwLjU4MDg1MTggMTUgOS44Mjk3NjYzNSAxNSA5IDE1IDcuMzQzMTQ1NzUgMTMuNjU2ODU0MiA2IDEyIDYgMTEuMTA0MDgzNCA2IDEwLjI5OTg5MjkgNi4zOTI3MjYwNCA5Ljc1MDE4OTE5IDcuMDE1NDE3MzcgOS40OTYwMTEwOSA3LjMwMzM0NDMxIDkuMjk2MjQzNjkgNy42NDA0MzkxMiA5LjE2Njk3NzgxIDguMDEwNjEwOTUiLz4gPGxpbmUgeDE9IjEyIiB5MT0iMTciIHgyPSIxMiIgeTI9IjE3Ii8+IDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIi8+IDwvc3ZnPg==');
  background-position: center left;
  background-repeat: no-repeat;
  background-size: 18px 18px;
  width: 18px;
  height: 18px;
`;

interface Props {
  message: string;
}

export const HelpIcon = (props: Props) => {
  return <Icon title={props.message} />;
};
