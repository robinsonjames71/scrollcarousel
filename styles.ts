import { theme } from '@/src/styles/theme'
import styled from '@emotion/styled'

export const CarouselStyles = styled.section<{
  gapBetweenSlides?: number
  fullWidth?: boolean
}>`
  position: relative;
  width: 100%;

  .container {
    display: flex;
    justify-content: center;
  }

  .viewport {
    display: flex;
    margin: 0 auto;
    ${({ fullWidth }) => fullWidth && 'justify-content: flex-start;'}

    ${({ gapBetweenSlides }) =>
      gapBetweenSlides && `gap: ${gapBetweenSlides}px;`}

    /* Carousel behaviour */
    overflow-x: scroll;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;

    /* Hide Scrollbars */
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }

    /* Unclickable when dragging and disable snap */
    &.active {
      scroll-snap-type: none;
      scroll-behavior: auto;
      cursor: grabbing;
      a {
        pointer-events: none;
      }
      .slide {
        scroll-snap-align: none;
      }
    }

    img {
      pointer-events: none;
      user-select: none;
    }
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    li,
    a,
    span {
      user-select: none;
    }
  }

  .slide {
    position: relative;
    scroll-snap-align: center;
    cursor: pointer;
  }

  .navigation {
    position: absolute;
    z-index: 2;
    transition: opacity 0.2s;
    opacity: 1;
    pointer-events: none;
    bottom: -100px;
    right: 120px;
  }

  .prev,
  .next {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    width: 24px;
    height: 24px;
    transform: translateY(-50%);
    border-radius: 50%;
    font-size: 0;
    outline: 0;
    border: 0;
    cursor: pointer;
    transition: background-color 0.2s;
    pointer-events: auto;
    min-width: auto;
    padding: 6px;

    path {
      stroke: white;
    }
  }

  .prev {
    right: 10px;

    svg {
      transform: rotate(180deg);
    }
  }

  .next {
    left: 10px;
  }

  .dots {
    position: absolute;
    right: 0;
    bottom: -40px;
    left: 0;
    text-align: center;
    z-index: 2;
  }

  .dots-list,
  .dot-item {
    display: inline-block;
  }
  .dots-list {
    padding-left: 0;
  }

  .dot-button {
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: ${theme.colors.lightgrey};
    background-clip: content-box;
    border-radius: 50%;
    font-size: 0;
    transition: all 0.1s ease-out;
    margin: 0 5px;
  }

  .active .dot-button {
    background-color: #000;
  }
`
