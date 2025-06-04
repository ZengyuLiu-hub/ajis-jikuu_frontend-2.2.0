import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Button, RangeSlider } from '../../components/atoms';

const Header = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 20px 0 10px;
  background-color: rgba(62, 62, 62, 1);
  width: 100%;
  height: 38px;
  grid-column-start: 1;
  grid-column-end: 3;

  div {
    display: flex;
    flex-direction: row;
    align-items: center;

    input + label {
      margin-left: 10px;
    }
  }

  > div {
    div + button {
      margin-left: 5px;
    }
  }

  div + div,
  button + label {
    margin-left: 10px;
  }

  label {
    display: flex;
    align-items: center;
    height: 27px;

    span {
      margin-right: 10px;
      color: rgba(255, 255, 255, 1);
    }
  }
`;

const Hamburger = styled.div`
  position: relative;
  width: 38px;
  height: 38px;

  &:hover {
    cursor: pointer;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: transparent;
    background-position: center center;
    background-repeat: no-repeat;
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg x='0px' y='0px' viewBox='0 0 512 512' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' style='width: 256px; height: 256px; opacity: 1;' xml:space='preserve'%3E%3Cstyle type='text/css'%3E.st0{fill:%234B4B4B;}%3C/style%3E%3Cg%3E%3Crect y='16' class='st0' width='512' height='96' rx='40' ry='40' style='fill: rgb(200, 200, 200);'%3E%3C/rect%3E%3Crect y='208' class='st0' width='512' height='96' rx='40' ry='40' style='fill: rgb(200, 200, 200);'%3E%3C/rect%3E%3Crect y='400' class='st0' width='512' height='96' rx='40' ry='40' style='fill: rgb(200, 200, 200);'%3E%3C/rect%3E%3C/g%3E%3C/svg%3E");
    background-size: 18px 18px;
  }
`;

const BackButton = styled(Button)`
  position: relative;
  background-color: rgba(230, 230, 230, 1);
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48px' height='48px' viewBox='0 0 24 24' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M9 6l-6 6 6 6'/%3E%3Cpath d='M21 12H4'/%3E%3Cpath stroke-linecap='round' d='M3 12h1'/%3E%3C/svg%3E");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 30px 30px;
  width: 33px;
  height: 33px;

  &:hover {
    background-color: rgba(183, 183, 183, 1);
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48px' height='48px' viewBox='0 0 24 24' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M9 6l-6 6 6 6'/%3E%3Cpath d='M21 12H4'/%3E%3Cpath stroke-linecap='round' d='M3 12h1'/%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 30px 30px;
  }
`;

const SaveButton = styled(Button)`
  position: relative;
  background-color: rgba(230, 230, 230, 1);
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48px' height='48px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M17.2928932,3.29289322 L21,7 L21,20 C21,20.5522847 20.5522847,21 20,21 L4,21 C3.44771525,21 3,20.5522847 3,20 L3,4 C3,3.44771525 3.44771525,3 4,3 L16.5857864,3 C16.8510029,3 17.1053568,3.10535684 17.2928932,3.29289322 Z'/%3E%3Crect width='10' height='8' x='7' y='13'/%3E%3Crect width='8' height='5' x='8' y='3'/%3E%3C/svg%3E");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 30px 30px;
  width: 33px;
  height: 33px;

  &:disabled {
    background-color: rgba(183, 183, 183, 1);
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48px' height='48px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M17.2928932,3.29289322 L21,7 L21,20 C21,20.5522847 20.5522847,21 20,21 L4,21 C3.44771525,21 3,20.5522847 3,20 L3,4 C3,3.44771525 3.44771525,3 4,3 L16.5857864,3 C16.8510029,3 17.1053568,3.10535684 17.2928932,3.29289322 Z'/%3E%3Crect width='10' height='8' x='7' y='13'/%3E%3Crect width='8' height='5' x='8' y='3'/%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 30px 30px;
  }

  &:hover {
    background-color: rgba(183, 183, 183, 1);
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48px' height='48px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M17.2928932,3.29289322 L21,7 L21,20 C21,20.5522847 20.5522847,21 20,21 L4,21 C3.44771525,21 3,20.5522847 3,20 L3,4 C3,3.44771525 3.44771525,3 4,3 L16.5857864,3 C16.8510029,3 17.1053568,3.10535684 17.2928932,3.29289322 Z'/%3E%3Crect width='10' height='8' x='7' y='13'/%3E%3Crect width='8' height='5' x='8' y='3'/%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 30px 30px;

    &:disabled {
      background-color: rgba(183, 183, 183, 1);
      background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48px' height='48px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M17.2928932,3.29289322 L21,7 L21,20 C21,20.5522847 20.5522847,21 20,21 L4,21 C3.44771525,21 3,20.5522847 3,20 L3,4 C3,3.44771525 3.44771525,3 4,3 L16.5857864,3 C16.8510029,3 17.1053568,3.10535684 17.2928932,3.29289322 Z'/%3E%3Crect width='10' height='8' x='7' y='13'/%3E%3Crect width='8' height='5' x='8' y='3'/%3E%3C/svg%3E");
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 30px 30px;
    }
  }

  &.unsaved::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    background-color: rgba(255, 0, 0, 1);
    border-radius: 4px;
    width: 10px;
    height: 10px;
  }
`;

const UndoButton = styled(Button)`
  background-color: rgba(230, 230, 230, 1);
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256px' height='256px' viewBox='0 0 24 24' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M4.71493213,9 L8.06176471,9 C14.65507,9 20,13.0983574 20,19.3875'/%3E%3Cpolyline points='9 14 4 9 9 4 9 4'/%3E%3C/svg%3E");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 30px 30px;
  width: 33px;
  height: 33px;

  &:disabled {
    background-color: rgba(183, 183, 183, 1);
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256px' height='256px' viewBox='0 0 24 24' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M4.71493213,9 L8.06176471,9 C14.65507,9 20,13.0983574 20,19.3875'/%3E%3Cpolyline points='9 14 4 9 9 4 9 4'/%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 30px 30px;
  }

  &:hover {
    background-color: rgba(183, 183, 183, 1);
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256px' height='256px' viewBox='0 0 24 24' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M4.71493213,9 L8.06176471,9 C14.65507,9 20,13.0983574 20,19.3875'/%3E%3Cpolyline points='9 14 4 9 9 4 9 4'/%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 30px 30px;

    &:disabled {
      background-color: rgba(183, 183, 183, 1);
      background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256px' height='256px' viewBox='0 0 24 24' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M4.71493213,9 L8.06176471,9 C14.65507,9 20,13.0983574 20,19.3875'/%3E%3Cpolyline points='9 14 4 9 9 4 9 4'/%3E%3C/svg%3E");
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 30px 30px;
    }
  }
`;

const RedoButton = styled(Button)`
  background-color: rgba(230, 230, 230, 1);
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256px' height='256px' viewBox='0 0 24 24' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M3.71493213,19.3875 C3.71493213,13.0983574 9.05986213,9 15.6531674,9 L19,9'/%3E%3Cpolyline points='15 4 20 9 15 14 15 14'/%3E%3C/svg%3E");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 30px 30px;
  width: 33px;
  height: 33px;

  &:disabled {
    background-color: rgba(183, 183, 183, 1);
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256px' height='256px' viewBox='0 0 24 24' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M3.71493213,19.3875 C3.71493213,13.0983574 9.05986213,9 15.6531674,9 L19,9'/%3E%3Cpolyline points='15 4 20 9 15 14 15 14'/%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 30px 30px;
  }

  &:hover {
    background-color: rgba(183, 183, 183, 1);
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256px' height='256px' viewBox='0 0 24 24' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M3.71493213,19.3875 C3.71493213,13.0983574 9.05986213,9 15.6531674,9 L19,9'/%3E%3Cpolyline points='15 4 20 9 15 14 15 14'/%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 30px 30px;

    &:disabled {
      background-color: rgba(183, 183, 183, 1);
      background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256px' height='256px' viewBox='0 0 24 24' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M3.71493213,19.3875 C3.71493213,13.0983574 9.05986213,9 15.6531674,9 L19,9'/%3E%3Cpolyline points='15 4 20 9 15 14 15 14'/%3E%3C/svg%3E");
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 30px 30px;
    }
  }
`;

const ImportExcelButton = styled(Button)`
  background-color: rgba(230, 230, 230, 1);
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48px' height='48px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M12,3 L12,16'/%3E%3Cpolyline points='7 12 12 17 17 12'/%3E%3Cpath d='M20,21 L4,21'/%3E%3C/svg%3E");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 30px 30px;
  width: 33px;
  height: 33px;

  &:disabled {
    background-color: rgba(183, 183, 183, 1);
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48px' height='48px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M12,3 L12,16'/%3E%3Cpolyline points='7 12 12 17 17 12'/%3E%3Cpath d='M20,21 L4,21'/%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 30px 30px;
  }

  &:hover {
    background-color: rgba(183, 183, 183, 1);
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48px' height='48px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M12,3 L12,16'/%3E%3Cpolyline points='7 12 12 17 17 12'/%3E%3Cpath d='M20,21 L4,21'/%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 30px 30px;

    &:disabled {
      background-color: rgba(183, 183, 183, 1);
      background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48px' height='48px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M12,3 L12,16'/%3E%3Cpolyline points='7 12 12 17 17 12'/%3E%3Cpath d='M20,21 L4,21'/%3E%3C/svg%3E");
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 30px 30px;
    }
  }
`;

const CompareLocationButton = styled(Button)`
  background-color: rgba(230, 230, 230, 1);
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 512 512' style='width: 48px; height: 48px;' xml:space='preserve'%3E%3Cg%3E%3Cpath d='M405.076,56.585h-40.646v25.882c0,3.113-0.342,6.155-0.962,9.094h45.96c5.091,0,9.22,4.13,9.22,9.22v356.46 c0,5.091-4.13,9.22-9.22,9.22H102.572c-5.091,0-9.22-4.13-9.22-9.22v-356.46c0-5.091,4.13-9.22,9.22-9.22h45.96 c-0.62-2.938-0.961-5.981-0.961-9.094V56.585h-40.647c-25.461,0-46.102,20.641-46.102,46.103v363.21 c0,25.461,20.641,46.102,46.102,46.102h298.152c25.461,0,46.102-20.641,46.102-46.102v-363.21 C451.178,77.226,430.537,56.585,405.076,56.585z'%3E%3C/path%3E%3Cpath d='M191.497,110.129h129.006c15.28,0,27.662-12.382,27.662-27.662v-3.177V57.943v-3.176 c0-15.28-12.382-27.662-27.662-27.662h-34.96C284.153,11.929,271.534,0,256,0c-15.542,0-28.162,11.929-29.552,27.105h-34.951 c-15.28,0-27.662,12.382-27.662,27.662v3.176v21.348v3.177C163.835,97.748,176.217,110.129,191.497,110.129z M256,16.265 c7.481,0,13.549,6.068,13.549,13.548c0,7.489-6.068,13.557-13.549,13.557c-7.489,0-13.557-6.068-13.557-13.557 C242.443,22.332,248.511,16.265,256,16.265z'%3E%3C/path%3E%3Cpolygon points='174.358,215.127 186.239,203.247 218.904,170.574 207.031,158.701 174.358,191.366 153.575,170.574 141.693,182.454 '%3E%3C/polygon%3E%3Cpolygon points='207.031,244.091 174.358,276.756 153.575,255.964 141.693,267.845 174.358,300.518 186.239,288.637 218.904,255.964 '%3E%3C/polygon%3E%3Cpolygon points='153.575,341.354 141.693,353.235 174.358,385.908 186.239,374.027 218.904,341.354 207.031,329.481 174.358,362.146 '%3E%3C/polygon%3E%3C/g%3E%3C/svg%3E%0A");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 30px 30px;
  width: 33px;
  height: 33px;

  &:disabled {
    background-color: rgba(183, 183, 183, 1);
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 512 512' style='width: 48px; height: 48px;' xml:space='preserve'%3E%3Cg%3E%3Cpath d='M405.076,56.585h-40.646v25.882c0,3.113-0.342,6.155-0.962,9.094h45.96c5.091,0,9.22,4.13,9.22,9.22v356.46 c0,5.091-4.13,9.22-9.22,9.22H102.572c-5.091,0-9.22-4.13-9.22-9.22v-356.46c0-5.091,4.13-9.22,9.22-9.22h45.96 c-0.62-2.938-0.961-5.981-0.961-9.094V56.585h-40.647c-25.461,0-46.102,20.641-46.102,46.103v363.21 c0,25.461,20.641,46.102,46.102,46.102h298.152c25.461,0,46.102-20.641,46.102-46.102v-363.21 C451.178,77.226,430.537,56.585,405.076,56.585z'%3E%3C/path%3E%3Cpath d='M191.497,110.129h129.006c15.28,0,27.662-12.382,27.662-27.662v-3.177V57.943v-3.176 c0-15.28-12.382-27.662-27.662-27.662h-34.96C284.153,11.929,271.534,0,256,0c-15.542,0-28.162,11.929-29.552,27.105h-34.951 c-15.28,0-27.662,12.382-27.662,27.662v3.176v21.348v3.177C163.835,97.748,176.217,110.129,191.497,110.129z M256,16.265 c7.481,0,13.549,6.068,13.549,13.548c0,7.489-6.068,13.557-13.549,13.557c-7.489,0-13.557-6.068-13.557-13.557 C242.443,22.332,248.511,16.265,256,16.265z'%3E%3C/path%3E%3Cpolygon points='174.358,215.127 186.239,203.247 218.904,170.574 207.031,158.701 174.358,191.366 153.575,170.574 141.693,182.454 '%3E%3C/polygon%3E%3Cpolygon points='207.031,244.091 174.358,276.756 153.575,255.964 141.693,267.845 174.358,300.518 186.239,288.637 218.904,255.964 '%3E%3C/polygon%3E%3Cpolygon points='153.575,341.354 141.693,353.235 174.358,385.908 186.239,374.027 218.904,341.354 207.031,329.481 174.358,362.146 '%3E%3C/polygon%3E%3C/g%3E%3C/svg%3E%0A");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 30px 30px;
  }

  &:hover {
    background-color: rgba(183, 183, 183, 1);
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 512 512' style='width: 48px; height: 48px;' xml:space='preserve'%3E%3Cg%3E%3Cpath d='M405.076,56.585h-40.646v25.882c0,3.113-0.342,6.155-0.962,9.094h45.96c5.091,0,9.22,4.13,9.22,9.22v356.46 c0,5.091-4.13,9.22-9.22,9.22H102.572c-5.091,0-9.22-4.13-9.22-9.22v-356.46c0-5.091,4.13-9.22,9.22-9.22h45.96 c-0.62-2.938-0.961-5.981-0.961-9.094V56.585h-40.647c-25.461,0-46.102,20.641-46.102,46.103v363.21 c0,25.461,20.641,46.102,46.102,46.102h298.152c25.461,0,46.102-20.641,46.102-46.102v-363.21 C451.178,77.226,430.537,56.585,405.076,56.585z'%3E%3C/path%3E%3Cpath d='M191.497,110.129h129.006c15.28,0,27.662-12.382,27.662-27.662v-3.177V57.943v-3.176 c0-15.28-12.382-27.662-27.662-27.662h-34.96C284.153,11.929,271.534,0,256,0c-15.542,0-28.162,11.929-29.552,27.105h-34.951 c-15.28,0-27.662,12.382-27.662,27.662v3.176v21.348v3.177C163.835,97.748,176.217,110.129,191.497,110.129z M256,16.265 c7.481,0,13.549,6.068,13.549,13.548c0,7.489-6.068,13.557-13.549,13.557c-7.489,0-13.557-6.068-13.557-13.557 C242.443,22.332,248.511,16.265,256,16.265z'%3E%3C/path%3E%3Cpolygon points='174.358,215.127 186.239,203.247 218.904,170.574 207.031,158.701 174.358,191.366 153.575,170.574 141.693,182.454 '%3E%3C/polygon%3E%3Cpolygon points='207.031,244.091 174.358,276.756 153.575,255.964 141.693,267.845 174.358,300.518 186.239,288.637 218.904,255.964 '%3E%3C/polygon%3E%3Cpolygon points='153.575,341.354 141.693,353.235 174.358,385.908 186.239,374.027 218.904,341.354 207.031,329.481 174.358,362.146 '%3E%3C/polygon%3E%3C/g%3E%3C/svg%3E%0A");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 30px 30px;

    &:disabled {
      background-color: rgba(183, 183, 183, 1);
      background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 512 512' style='width: 48px; height: 48px;' xml:space='preserve'%3E%3Cg%3E%3Cpath d='M405.076,56.585h-40.646v25.882c0,3.113-0.342,6.155-0.962,9.094h45.96c5.091,0,9.22,4.13,9.22,9.22v356.46 c0,5.091-4.13,9.22-9.22,9.22H102.572c-5.091,0-9.22-4.13-9.22-9.22v-356.46c0-5.091,4.13-9.22,9.22-9.22h45.96 c-0.62-2.938-0.961-5.981-0.961-9.094V56.585h-40.647c-25.461,0-46.102,20.641-46.102,46.103v363.21 c0,25.461,20.641,46.102,46.102,46.102h298.152c25.461,0,46.102-20.641,46.102-46.102v-363.21 C451.178,77.226,430.537,56.585,405.076,56.585z'%3E%3C/path%3E%3Cpath d='M191.497,110.129h129.006c15.28,0,27.662-12.382,27.662-27.662v-3.177V57.943v-3.176 c0-15.28-12.382-27.662-27.662-27.662h-34.96C284.153,11.929,271.534,0,256,0c-15.542,0-28.162,11.929-29.552,27.105h-34.951 c-15.28,0-27.662,12.382-27.662,27.662v3.176v21.348v3.177C163.835,97.748,176.217,110.129,191.497,110.129z M256,16.265 c7.481,0,13.549,6.068,13.549,13.548c0,7.489-6.068,13.557-13.549,13.557c-7.489,0-13.557-6.068-13.557-13.557 C242.443,22.332,248.511,16.265,256,16.265z'%3E%3C/path%3E%3Cpolygon points='174.358,215.127 186.239,203.247 218.904,170.574 207.031,158.701 174.358,191.366 153.575,170.574 141.693,182.454 '%3E%3C/polygon%3E%3Cpolygon points='207.031,244.091 174.358,276.756 153.575,255.964 141.693,267.845 174.358,300.518 186.239,288.637 218.904,255.964 '%3E%3C/polygon%3E%3Cpolygon points='153.575,341.354 141.693,353.235 174.358,385.908 186.239,374.027 218.904,341.354 207.031,329.481 174.358,362.146 '%3E%3C/polygon%3E%3C/g%3E%3C/svg%3E%0A");
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 30px 30px;
    }
  }
`;

const CsvOutputButton = styled(Button)`
  background-color: rgba(230, 230, 230, 1);
  background-image: url("data:image/png;base64,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");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 30px 30px;
  width: 33px;
  height: 33px;

  &:hover {
    background-color: rgba(183, 183, 183, 1);
    background-image: url("data:image/png;base64,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");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 30px 30px;
  }
`;

const OverallNoteButton = styled(Button)`
  background-color: rgba(230, 230, 230, 1);
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 512 512' width='48px' height='48px'%3E%3Cg%3E%3Cpath d='M17.763,181.363h44.603c9.806,0,17.763-7.956,17.763-17.779c0-9.816-7.957-17.772-17.763-17.772H17.763C7.956,145.812,0,153.768,0,163.584C0,173.407,7.956,181.363,17.763,181.363z' style='fill: rgb(62, 62, 62);'%3E%3C/path%3E%3Crect x='21.952' y='199.963' width='33.253' height='112.075' style='fill: rgb(62, 62, 62);'%3E%3C/rect%3E%3Cpath d='M80.13,348.417c0-9.816-7.957-17.78-17.763-17.78H17.763C7.956,330.638,0,338.602,0,348.417c0,9.814,7.956,17.771,17.763,17.771h44.603C72.173,366.188,80.13,358.232,80.13,348.417z' style='fill: rgb(62, 62, 62);'%3E%3C/path%3E%3Crect x='134.227' y='154.499' width='149.64' height='24.94' style='fill: rgb(62, 62, 62);'%3E%3C/rect%3E%3Crect x='134.227' y='245.946' width='149.64' height='24.94' style='fill: rgb(62, 62, 62);'%3E%3C/rect%3E%3Crect x='134.227' y='337.392' width='91.446' height='24.94' style='fill: rgb(62, 62, 62);'%3E%3C/rect%3E%3Cpath d='M55.205,78.648c0.008-3.824,3.118-6.933,6.938-6.942H315.65c8.48,0.008,15.998,3.385,21.571,8.93c5.545,5.578,8.926,13.095,8.934,21.572v59.614c10.899-16.205,21.96-30.826,33.253-43.418v-16.196c-0.012-35.218-28.54-63.746-63.759-63.755H62.143C39.935,38.47,21.964,56.444,21.952,78.648v48.565h33.253V78.648z' style='fill: rgb(62, 62, 62);'%3E%3C/path%3E%3Cpath d='M346.156,313.702v96.09c-0.008,8.475-3.389,15.993-8.934,21.562c-5.573,5.553-13.091,8.931-21.571,8.938H62.143c-3.82-0.007-6.929-3.117-6.938-6.941v-48.564H21.952v48.564c0.012,22.204,17.983,40.178,40.191,40.194H315.65c35.218-0.007,63.746-28.536,63.759-63.754v-114.17c-8.22,5.423-18.206,9.101-29.491,10.684C348.765,308.571,347.491,311.072,346.156,313.702z' style='fill: rgb(62, 62, 62);'%3E%3C/path%3E%3Cpath d='M457.935,95.486c-74.065,10.204-151.463,189.371-186.368,253.677c-8.768,16.156,11.622,29.64,20.645,14.175c6.503-11.114,41.968-81.12,41.968-81.12c38.64,1.274,52.892-25.703,37.446-42.46c51.926,1.072,77.657-27.506,62.935-44.847c15.485,4.904,28.905,1.624,48.824-9.238C525.898,162.487,523.913,84.875,457.935,95.486z' style='fill: rgb(62, 62, 62);'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 30px 30px;
  width: 33px;
  height: 33px;

  &:hover {
    background-color: rgba(183, 183, 183, 1);
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 512 512' width='48px' height='48px'%3E%3Cg%3E%3Cpath d='M17.763,181.363h44.603c9.806,0,17.763-7.956,17.763-17.779c0-9.816-7.957-17.772-17.763-17.772H17.763C7.956,145.812,0,153.768,0,163.584C0,173.407,7.956,181.363,17.763,181.363z' style='fill: rgb(62, 62, 62);'%3E%3C/path%3E%3Crect x='21.952' y='199.963' width='33.253' height='112.075' style='fill: rgb(62, 62, 62);'%3E%3C/rect%3E%3Cpath d='M80.13,348.417c0-9.816-7.957-17.78-17.763-17.78H17.763C7.956,330.638,0,338.602,0,348.417c0,9.814,7.956,17.771,17.763,17.771h44.603C72.173,366.188,80.13,358.232,80.13,348.417z' style='fill: rgb(62, 62, 62);'%3E%3C/path%3E%3Crect x='134.227' y='154.499' width='149.64' height='24.94' style='fill: rgb(62, 62, 62);'%3E%3C/rect%3E%3Crect x='134.227' y='245.946' width='149.64' height='24.94' style='fill: rgb(62, 62, 62);'%3E%3C/rect%3E%3Crect x='134.227' y='337.392' width='91.446' height='24.94' style='fill: rgb(62, 62, 62);'%3E%3C/rect%3E%3Cpath d='M55.205,78.648c0.008-3.824,3.118-6.933,6.938-6.942H315.65c8.48,0.008,15.998,3.385,21.571,8.93c5.545,5.578,8.926,13.095,8.934,21.572v59.614c10.899-16.205,21.96-30.826,33.253-43.418v-16.196c-0.012-35.218-28.54-63.746-63.759-63.755H62.143C39.935,38.47,21.964,56.444,21.952,78.648v48.565h33.253V78.648z' style='fill: rgb(62, 62, 62);'%3E%3C/path%3E%3Cpath d='M346.156,313.702v96.09c-0.008,8.475-3.389,15.993-8.934,21.562c-5.573,5.553-13.091,8.931-21.571,8.938H62.143c-3.82-0.007-6.929-3.117-6.938-6.941v-48.564H21.952v48.564c0.012,22.204,17.983,40.178,40.191,40.194H315.65c35.218-0.007,63.746-28.536,63.759-63.754v-114.17c-8.22,5.423-18.206,9.101-29.491,10.684C348.765,308.571,347.491,311.072,346.156,313.702z' style='fill: rgb(62, 62, 62);'%3E%3C/path%3E%3Cpath d='M457.935,95.486c-74.065,10.204-151.463,189.371-186.368,253.677c-8.768,16.156,11.622,29.64,20.645,14.175c6.503-11.114,41.968-81.12,41.968-81.12c38.64,1.274,52.892-25.703,37.446-42.46c51.926,1.072,77.657-27.506,62.935-44.847c15.485,4.904,28.905,1.624,48.824-9.238C525.898,162.487,523.913,84.875,457.935,95.486z' style='fill: rgb(62, 62, 62);'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 30px 30px;
  }
`;

const ExclusiveLockButton = styled(Button)`
  background: linear-gradient(
    rgba(66, 135, 245, 1),
    rgba(51, 115, 230, 1),
    rgba(36, 100, 215, 1)
  );
  border: 1px solid rgba(0, 0, 255, 1);
  color: rgba(255, 255, 255, 1);

  &:hover {
    background: linear-gradient(
      rgba(18, 87, 197, 1),
      rgba(4, 73, 183, 1),
      rgba(0, 59, 179, 1)
    );
  }

  &.locked {
    background: linear-gradient(
      rgba(245, 66, 100, 1),
      rgba(230, 51, 85, 1),
      rgba(215, 36, 70, 1)
    );
    border: 1px solid rgba(255, 0, 0, 1);
    color: rgba(255, 255, 255, 1);

    &:hover {
      background: linear-gradient(
        rgba(197, 18, 87, 1),
        rgba(183, 51, 4, 1),
        rgba(179, 36, 0, 1)
      );
    }
  }
`;

const AutoSaveStatus = styled.div`
  > span {
    color: rgba(220, 220, 230, 1);
    font-weight: bold;
  }
`;

const PreferencesButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  background-color: transparent;
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cdefs%3E%3Cstyle%3E.a, .b { fill: none; stroke: %23c8c8c8; stroke-width: 2px; } .b { stroke-linecap: round; stroke-linejoin: round; }%3C/style%3E%3C/defs%3E%3Cg%3E%3Cpath class='a' d='M24,28.6a4.52,4.52,0,1,1,4.23-2.87A4.44,4.44,0,0,1,24,28.6Z'/%3E%3Cpath class='b' d='M35,21.67l1.34-1.1a1.55,1.55,0,0,0,.51-2l-1.68-2.91A1.49,1.49,0,0,0,33.31,15l-1.91.73a1.45,1.45,0,0,1-1.35-.16,10.73,10.73,0,0,0-1.75-1,1.39,1.39,0,0,1-.82-1.09l-.34-2a1.47,1.47,0,0,0-1.46-1.24H22.32a1.47,1.47,0,0,0-1.46,1.24l-.34,2a1.4,1.4,0,0,1-.82,1.09,11.26,11.26,0,0,0-1.76,1,1.42,1.42,0,0,1-1.34.16L14.69,15a1.49,1.49,0,0,0-1.81.65L11.2,18.55a1.48,1.48,0,0,0,.35,1.89l1.53,1.25A1.49,1.49,0,0,1,13.61,23a12.51,12.51,0,0,0,0,2,1.51,1.51,0,0,1-.54,1.29l-1.52,1.24a1.49,1.49,0,0,0-.34,1.89l1.68,2.91a1.49,1.49,0,0,0,1.81.65l1.76-.67a1.46,1.46,0,0,1,1.36.16,10.48,10.48,0,0,0,1.92,1.12,1.47,1.47,0,0,1,.83,1.11l.3,1.84a1.47,1.47,0,0,0,1.46,1.24h3.36a1.47,1.47,0,0,0,1.46-1.24l.3-1.84a1.5,1.5,0,0,1,.83-1.12,10.2,10.2,0,0,0,1.92-1.11,1.43,1.43,0,0,1,1.36-.16l1.76.67a1.49,1.49,0,0,0,1.81-.65l1.68-2.91a1.48,1.48,0,0,0-.35-1.89L35,26.33A1.48,1.48,0,0,1,34.42,25a9,9,0,0,0,0-2A1.48,1.48,0,0,1,35,21.67Z'/%3E%3C/g%3E%3C/svg%3E");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 30px 30px;
  border: none;
  width: 38px;
  height: 38px;

  &:hover {
    background-color: transparent;
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cdefs%3E%3Cstyle%3E.a, .b { fill: none; stroke: %23f5f5f5; stroke-width: 2px; } .b { stroke-linecap: round; stroke-linejoin: round; }%3C/style%3E%3C/defs%3E%3Cg%3E%3Cpath class='a' d='M24,28.6a4.52,4.52,0,1,1,4.23-2.87A4.44,4.44,0,0,1,24,28.6Z'/%3E%3Cpath class='b' d='M35,21.67l1.34-1.1a1.55,1.55,0,0,0,.51-2l-1.68-2.91A1.49,1.49,0,0,0,33.31,15l-1.91.73a1.45,1.45,0,0,1-1.35-.16,10.73,10.73,0,0,0-1.75-1,1.39,1.39,0,0,1-.82-1.09l-.34-2a1.47,1.47,0,0,0-1.46-1.24H22.32a1.47,1.47,0,0,0-1.46,1.24l-.34,2a1.4,1.4,0,0,1-.82,1.09,11.26,11.26,0,0,0-1.76,1,1.42,1.42,0,0,1-1.34.16L14.69,15a1.49,1.49,0,0,0-1.81.65L11.2,18.55a1.48,1.48,0,0,0,.35,1.89l1.53,1.25A1.49,1.49,0,0,1,13.61,23a12.51,12.51,0,0,0,0,2,1.51,1.51,0,0,1-.54,1.29l-1.52,1.24a1.49,1.49,0,0,0-.34,1.89l1.68,2.91a1.49,1.49,0,0,0,1.81.65l1.76-.67a1.46,1.46,0,0,1,1.36.16,10.48,10.48,0,0,0,1.92,1.12,1.47,1.47,0,0,1,.83,1.11l.3,1.84a1.47,1.47,0,0,0,1.46,1.24h3.36a1.47,1.47,0,0,0,1.46-1.24l.3-1.84a1.5,1.5,0,0,1,.83-1.12,10.2,10.2,0,0,0,1.92-1.11,1.43,1.43,0,0,1,1.36-.16l1.76.67a1.49,1.49,0,0,0,1.81-.65l1.68-2.91a1.48,1.48,0,0,0-.35-1.89L35,26.33A1.48,1.48,0,0,1,34.42,25a9,9,0,0,0,0-2A1.48,1.48,0,0,1,35,21.67Z'/%3E%3C/g%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 30px 30px;
  }
`;

interface HamburgerProps {
  onClick(e: React.MouseEvent<HTMLDivElement>): void;
}
const HamburgerContent = React.memo((props: HamburgerProps) => (
  <Hamburger onClick={props.onClick}></Hamburger>
));

interface BackProps {
  canBack: boolean;
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}
const BackContent = React.memo((props: BackProps) => {
  const [t] = useTranslation();

  if (props.canBack) {
    return (
      <div>
        <BackButton
          title={`${t('organisms:EditorHeader.back')}`}
          onClick={props.onClick}
        ></BackButton>
      </div>
    );
  }
  return <></>;
});

interface DataProps {
  hasUnsavedData: boolean;
  canSave: boolean;
  onClickSave(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}
const DataContent = React.memo((props: DataProps) => {
  const [t] = useTranslation();

  return (
    <div>
      <SaveButton
        className={classNames({ unsaved: props.hasUnsavedData })}
        title={`${t('organisms:EditorHeader.data.save')}`}
        onClick={props.onClickSave}
        disabled={!props.canSave}
      ></SaveButton>
    </div>
  );
});

interface ExcelProps {
  canExcelImport: boolean;
  onClickShowExcelImport(): void;
}
const ExcelContent = React.memo((props: ExcelProps) => {
  const [t] = useTranslation();

  return (
    <div>
      <ImportExcelButton
        title={`${t('organisms:EditorHeader.showExcelImport')}`}
        onClick={props.onClickShowExcelImport}
        disabled={!props.canExcelImport}
      ></ImportExcelButton>
    </div>
  );
});

interface CompareLocationProps {
  canLocationCompare: boolean;
  onClickLocationComparation(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void;
}

const CompareLocationContent = React.memo((props: CompareLocationProps) => {
  const [t] = useTranslation();

  return (
    <div>
      <CompareLocationButton
        title={`${t('organisms:EditorHeader.showLocationComparation')}`}
        onClick={props.onClickLocationComparation}
        disabled={!props.canLocationCompare}
      ></CompareLocationButton>
    </div>
  );
});

interface CsvOutputProps {
  onClickDownloadCsv(e: React.MouseEvent<HTMLButtonElement>): void;
}

const CsvOutputContent = React.memo((props: CsvOutputProps) => {
  const [t] = useTranslation();

  return (
    <div>
      <CsvOutputButton
        title={`${t('organisms:EditorHeader.showCsvOutput')}`}
        onClick={props.onClickDownloadCsv}
      ></CsvOutputButton>
    </div>
  );
});

interface NoteProps {
  onClickEditorNote(e: React.MouseEvent<HTMLButtonElement>): void;
}
const NoteContent = React.memo((props: NoteProps) => {
  const [t] = useTranslation();

  return (
    <div>
      <label>
        <OverallNoteButton
          title={`${t('organisms:EditorHeader.showEditorNote')}`}
          onClick={props.onClickEditorNote}
        ></OverallNoteButton>
      </label>
    </div>
  );
});

interface UndoRedoProps {
  canUndo: boolean;
  canRedo: boolean;
  onClickUndo(e: React.MouseEvent<HTMLButtonElement>): void;
  onClickRedo(e: React.MouseEvent<HTMLButtonElement>): void;
}
const UndoRedoContent = React.memo((props: UndoRedoProps) => {
  const [t] = useTranslation();

  return (
    <div>
      <UndoButton
        title={`${t('organisms:EditorHeader.data.undo')}`}
        onClick={props.onClickUndo}
        disabled={!props.canUndo}
      ></UndoButton>
      <RedoButton
        title={`${t('organisms:EditorHeader.data.redo')}`}
        onClick={props.onClickRedo}
        disabled={!props.canRedo}
      ></RedoButton>
    </div>
  );
});

interface MoveProps {
  onClick(e: React.MouseEvent<HTMLButtonElement>): void;
  disabled: boolean;
}

const MoveToTop = React.memo((props: MoveProps) => {
  const [t] = useTranslation();

  return (
    <Button onClick={props.onClick} disabled={props.disabled}>
      {t('organisms:EditorHeader.displayOrder.moveToTop')}
    </Button>
  );
});

const MoveUp = React.memo((props: MoveProps) => {
  const [t] = useTranslation();

  return (
    <Button onClick={props.onClick} disabled={props.disabled}>
      {t('organisms:EditorHeader.displayOrder.moveUp')}
    </Button>
  );
});

const MoveDown = React.memo((props: MoveProps) => {
  const [t] = useTranslation();

  return (
    <Button onClick={props.onClick} disabled={props.disabled}>
      {t('organisms:EditorHeader.displayOrder.moveDown')}
    </Button>
  );
});

const MoveToBottom = React.memo((props: MoveProps) => {
  const [t] = useTranslation();

  return (
    <Button onClick={props.onClick} disabled={props.disabled}>
      {t('organisms:EditorHeader.displayOrder.moveToBottom')}
    </Button>
  );
});

interface RangeSliderProps {
  stageScale: number;
  onChangeStageScale(e: number): void;
  onClickScaleUp(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickScaleDown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickScaleReset(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}
const RangeSliderContent = React.memo((props: RangeSliderProps) => {
  const [t] = useTranslation();

  return (
    <div>
      <RangeSlider
        min={20}
        max={150}
        step={10}
        value={props.stageScale}
        onChange={(e) => props.onChangeStageScale(Number(e.target.value))}
        onClickIncremental={props.onClickScaleUp}
        onClickDecremental={props.onClickScaleDown}
      />
      <Button onClick={() => props.onChangeStageScale(50)}>
        {t('organisms:EditorHeader.scale.percent50')}
      </Button>
      <Button onClick={() => props.onChangeStageScale(100)}>
        {t('organisms:EditorHeader.scale.percent100')}
      </Button>
      <Button onClick={() => props.onChangeStageScale(150)}>
        {t('organisms:EditorHeader.scale.percent150')}
      </Button>
    </div>
  );
});

interface ExclusiveLockProps {
  canExclusiveLock: boolean;
  isExclusiveLocked: boolean;
  isOthersExclusiveLocked: boolean;
  onClickExclusiveLock(lock: boolean): void;
}
const ExclusiveLockContent = React.memo((props: ExclusiveLockProps) => {
  const [t] = useTranslation();
  return (
    <div>
      {props.canExclusiveLock && !props.isOthersExclusiveLocked && (
        <ExclusiveLockButton
          className={classNames({ locked: props.isExclusiveLocked })}
          onClick={() => props.onClickExclusiveLock(!props.isExclusiveLocked)}
        >
          {props.isExclusiveLocked
            ? t('organisms:EditorHeader.exclusiveLock.unlock')
            : t('organisms:EditorHeader.exclusiveLock.lock')}
        </ExclusiveLockButton>
      )}
    </div>
  );
});

interface PreferencesProps {
  onClickEditorPreferences(e: React.MouseEvent<HTMLButtonElement>): void;
}
const PreferencesContent = React.memo((props: PreferencesProps) => (
  <div>
    <PreferencesButton
      onClick={props.onClickEditorPreferences}
    ></PreferencesButton>
  </div>
));

interface Props
  extends DataProps,
    ExcelProps,
    CompareLocationProps,
    CsvOutputProps,
    NoteProps,
    UndoRedoProps,
    RangeSliderProps,
    ExclusiveLockProps,
    PreferencesProps {
  selectedNodeIds: string[];
  enableBackButton: boolean;
  waitingAutoSave: boolean;
  onClickHamburger(e: React.MouseEvent<HTMLDivElement>): void;
  onClickBack(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickShapeToForeground(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void;
  onClickShapeToFront(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickShapeToBack(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickShapeToBackmost(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void;
}

/**
 * マップエディタ：ヘッダー
 */
export const EditorHeader = (props: Props) => {
  const [t] = useTranslation();

  return (
    <Header>
      <HamburgerContent onClick={props.onClickHamburger} />
      <BackContent
        canBack={props.enableBackButton}
        onClick={props.onClickBack}
      />
      <DataContent
        canSave={props.canSave}
        hasUnsavedData={props.hasUnsavedData}
        onClickSave={props.onClickSave}
      />
      <ExcelContent
        canExcelImport={props.canExcelImport}
        onClickShowExcelImport={props.onClickShowExcelImport}
      />
      <CompareLocationContent
        canLocationCompare={props.canLocationCompare}
        onClickLocationComparation={props.onClickLocationComparation}
      />
      <CsvOutputContent {...props} />
      <NoteContent onClickEditorNote={props.onClickEditorNote} />
      <UndoRedoContent
        canUndo={props.canUndo}
        canRedo={props.canRedo}
        onClickUndo={props.onClickUndo}
        onClickRedo={props.onClickRedo}
      />
      <div>
        <MoveToTop
          onClick={props.onClickShapeToForeground}
          disabled={props.selectedNodeIds.length !== 1}
        />
        <MoveUp
          onClick={props.onClickShapeToFront}
          disabled={props.selectedNodeIds.length !== 1}
        />
        <MoveDown
          onClick={props.onClickShapeToBack}
          disabled={props.selectedNodeIds.length !== 1}
        />
        <MoveToBottom
          onClick={props.onClickShapeToBackmost}
          disabled={props.selectedNodeIds.length !== 1}
        />
      </div>
      <RangeSliderContent
        stageScale={props.stageScale}
        onChangeStageScale={props.onChangeStageScale}
        onClickScaleUp={props.onClickScaleUp}
        onClickScaleDown={props.onClickScaleDown}
        onClickScaleReset={props.onClickScaleReset}
      />
      <ExclusiveLockContent
        canExclusiveLock={props.canExclusiveLock}
        isExclusiveLocked={props.isExclusiveLocked}
        isOthersExclusiveLocked={props.isOthersExclusiveLocked}
        onClickExclusiveLock={props.onClickExclusiveLock}
      />
      <AutoSaveStatus>
        {props.waitingAutoSave && (
          <span>{t('organisms:EditorLocationInfo.waitingAutoSave')}</span>
        )}
      </AutoSaveStatus>
      <PreferencesContent
        onClickEditorPreferences={props.onClickEditorPreferences}
      />
    </Header>
  );
};
