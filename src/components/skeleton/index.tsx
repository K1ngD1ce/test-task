import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
`;

const Skeleton = styled.div<{
  $width?: string;
  $height?: string;
  $radius?: string;
}>`
  width: ${(props) => props.$width || '100%'};
  height: ${(props) => props.$height || '16px'};
  border-radius: ${(props) => props.$radius || '12px'};
  background: linear-gradient(
    90deg,
    var(--grey-20) 25%,
    var(--grey-15, #ececec) 37%,
    var(--grey-20) 63%
  );
  background-size: 400px 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`;

const SkeletonList = () => {
  return (
    <>
      <Skeleton $width="20%" $height="31px" />
      <Skeleton $width="100%" $height="860px" />
    </>
  );
};
export default SkeletonList;
