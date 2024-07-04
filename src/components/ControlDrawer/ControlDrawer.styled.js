import styled, { keyframes } from "styled-components";

// Keyframes for animations
const scaleUpFirstCircle = keyframes`
  0% {
    width: 140px;
    height: 140px;
    background-color: #ffffff85;
  }
  100% {
    width: 200px;
    height: 200px;
    background-color: #ffffff;
  }
`;

const scaleDownSecondCircle = keyframes`
  0% {
    width: 265px;
    height: 265px;
  }
  100% {
    width: 245px;
    height: 245px;
  }
`;

const scaleUpFirstIcon = keyframes`
  0% {
    width: 45px;
    height: 45px;
    transform: translateX(-12px) translateY(-20px);
    color: #ff000091;
  }
  100% {
    width: 55px;
    height: 55px;
    transform: translateX(-12px) translateY(-26px);
    color: #f42525d0;
  }
`;

const scaleDownFirstIcon = keyframes`
  0% {
    color: #f42525d0;
  }
  100% {
    color: #ff00003f;
  }
`;

const scaleUpSecondCircle = keyframes`
  0% {
    width: 265px;
    height: 265px;
    background-color: #ffffff75;
  }
  100% {
    width: 300px;
    height: 300px;
    background-color: #ffffff;
  }
`;

const transparencyBlue = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
  }
`;

const transparencyPink = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
    transform: translateX(-10px);
  }
`;

const changeSecondIconColorOnSecondHovered = keyframes`
  0% {
    color: #ff000071;
    width: 25px;
    height: 25px;
    transform: translateY(-50%);
    transform: translateX(50px);
  }
  100% {
    color: #f42525d0;
    width: 30px;
    height: 30px;
    transform: translateY(-50%);
    transform: translateX(5px);
  }
`;

export const ArrowAlwaysVisibleRightContainer = styled.div`
  height: 100vh;
  width: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1 !important;
`;

export const ToggleArrow = styled.div`
  width: fit-content;
  height: fit-content;
  cursor: pointer;
  position: relative;
`;

export const BackgroundCircle = styled.div`
  background-color: #ffffff85;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.31);
  border-radius: 50%;
  width: 140px;
  height: 140px;
  position: absolute;
  transform: translateY(-50%) translateX(15%);
  z-index: 20;

  &.hovered-first {
    animation: ${scaleUpFirstCircle} 0.15s ease-out forwards;
  }

  &.hovered-second {
    background-color: pink;
  }
`;

export const FirstIconContainer = styled.div`
  .first-icon {
    width: 45px;
    height: 45px;
    position: absolute;
    transform: translateX(-12px) translateY(-20px);
    color: #ff000091;
    z-index: 21;

    &.hovered-first {
      animation: ${scaleUpFirstIcon} 0.15s ease-out forwards;
    }

    &.hovered-second {
      background-color: pink;
    }
  }
`;

export const SecondBackgroundCircle = styled.div`
  background-color: #ffffff75;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.31);
  border-radius: 50%;
  width: 265px;
  height: 265px;
  position: absolute;
  transform: translateY(-50%) translateX(20%);
  z-index: 17;

  &.hovered-second {
    animation: ${scaleUpSecondCircle} 0.15s ease-out forwards;
  }

  &.hovered-first {
    display: none;
  }
`;

export const SecondIcon = styled.div`
  width: 25px;
  height: 25px;
  position: absolute;
  transform: translateY(-50%) translateX(50px);
  color: #ff000071;
  z-index: 18;

  &.hovered-second,
  .second-background-circle.hovered-second ~ & {
    animation: ${changeSecondIconColorOnSecondHovered} 0.15s ease-in forwards;
  }
`;

export const BackgroundCircleHoveredFirst = styled(BackgroundCircle)`
  &.hovered-first ~ .second-background-circle,
  &.hovered-first ~ .second-icon,
  .first-icon-container .first-icon.hovered-first ~ .second-background-circle,
  .first-icon-container .first-icon.hovered-first ~ .second-icon {
    animation: ${transparencyBlue} 0.15s ease-out forwards;
  }
`;

export const SecondBackgroundCircleHoveredSecond = styled(
  SecondBackgroundCircle
)`
  &.hovered-second ~ .background-circle,
  &.hovered-second ~ .first-icon-container .first-icon,
  .second-icon.hovered-second ~ .background-circle,
  .second-icon.hovered-second ~ .first-icon-container .first-icon {
    animation: ${transparencyPink} 0.15s ease-out forwards;
  }
`;
