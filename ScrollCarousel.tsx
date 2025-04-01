import {
  type FC,
  useEffect,
  useState,
  useRef,
  type PropsWithChildren,
} from 'react'
// import { useLongPress, useScrolling } from 'react-use'
import { useScrolling } from 'react-use'

import { CarouselStyles } from './styles'

import { ReactComponent as ScrollIcon } from '/public/assets/icons/scroll-arrow-left.svg?svgInline'
import { Button } from '../Button'
import { nextHandler, prevHandler, usePosition } from './usePosition'

export interface HTMLDivElementWithTimeout extends HTMLDivElement {
  scrollTimeout?: ReturnType<typeof setTimeout>
}

export const ScrollCarousel: FC<
  PropsWithChildren<{
    carouselName: string
    dots?: boolean
    className?: string
    gapBetweenSlides?: number
    navigationButtons?: boolean
    initialSlide?: number
    fullWidth?: boolean
  }>
> = ({
  children,
  carouselName,
  className,
  dots,
  gapBetweenSlides = 1,
  navigationButtons,
  initialSlide = 1,
  fullWidth = false,
}) => {
  const viewportRef = useRef<HTMLDivElementWithTimeout>(null!)
  const slideRef = useRef<HTMLDivElement[]>([])
  const [mouseScroll, setMouseScroll] = useState({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
  })
  const [activeSlide, setActiveSlide] = useState(initialSlide - 1)
  const scrolling = useScrolling(viewportRef)

  useEffect(() => {
    if (Array.isArray(children)) {
      slideRef.current = slideRef.current.slice(0, children.length)
    }
  }, [children])

  const onLongPress = (e) => {
    if (!viewportRef.current) return
    viewportRef.current.classList.add('active')

    setMouseScroll({
      isDown: true,
      startX: e.pageX - viewportRef.current.offsetLeft,
      scrollLeft: viewportRef.current.scrollLeft,
    })
  }

  // const defaultOptions = {
  //   isPreventDefault: true,
  //   delay: 200,
  // }
  // const { onMouseDown, onMouseUp } = useLongPress(onLongPress, defaultOptions)

  const mouseUpHandler = function () {
    // onMouseUp()
    if (!viewportRef.current) return
    if (viewportRef.current.classList.contains('active')) {
      setMouseScroll({
        isDown: false,
        startX: 0,
        scrollLeft: 0,
      })
      viewportRef.current.classList.remove('active')
    }
  }

  const mouseMoveHandler = function (e) {
    if (!viewportRef.current) return
    if (!mouseScroll.isDown) return
    e.preventDefault()
    const x = e.pageX - viewportRef.current.offsetLeft
    const walk = (x - mouseScroll.startX) * 3 //scroll-fast
    viewportRef.current.scrollLeft = mouseScroll.scrollLeft - walk
  }

  useEffect(() => {
    slideRef.current.forEach((child) => {
      child.setAttribute('draggable', 'false')

      Array.from(child.children).forEach((grandChild: HTMLElement) => {
        grandChild.setAttribute('draggable', 'false')
      })
    })
  }, [slideRef])

  usePosition({
    viewportRef,
    scrolling,
    slideRef,
    setActiveSlide,
    initialSlide,
    gapBetweenSlides,
  })

  return (
    <CarouselStyles
      className={className}
      aria-label="Carousel"
      onMouseMove={mouseMoveHandler}
      onMouseUp={mouseUpHandler}
      onMouseLeave={mouseUpHandler}
      onMouseDown={onLongPress}
      gapBetweenSlides={gapBetweenSlides}
      fullWidth={fullWidth}
    >
      <div className="container">
        <div className="viewport" ref={viewportRef}>
          {Array.isArray(children) &&
            children.map((child, idx) => {
              return (
                <div
                  id={`${carouselName}-slide${idx + 1}`}
                  tabIndex={0}
                  className={`slide ${idx === activeSlide ? 'active' : ''}`}
                  key={`${carouselName}-carousel-${idx}`}
                  ref={(el) => {
                    if (el) {
                      slideRef.current[idx] = el
                    }
                  }}
                >
                  {child}
                </div>
              )
            })}
        </div>

        {navigationButtons && (
          <div className="navigation">
            <Button
              variant="black"
              className="prev"
              onClick={() =>
                prevHandler({
                  activeSlide,
                  slideRef,
                  scrolling,
                  viewportRef,
                  setActiveSlide,
                })
              }
              disabled={activeSlide === 0}
            >
              <ScrollIcon />
              Previous slide
            </Button>

            <Button
              variant="black"
              className="next"
              onClick={() =>
                nextHandler({
                  activeSlide,
                  slideRef,
                  scrolling,
                  viewportRef,
                  setActiveSlide,
                })
              }
              disabled={activeSlide === slideRef.current.length - 1}
            >
              <ScrollIcon />
              Next slide
            </Button>
          </div>
        )}
        {dots && (
          <aside className="dots">
            <ol className="dots-list">
              {Array.isArray(children) &&
                children.map((_, idx) => (
                  <li
                    className={`dot-item ${idx === activeSlide ? 'active' : ''}`}
                    key={`${carouselName}-carousel-dot-${idx}`}
                  >
                    <a
                      href={`#${carouselName}-slide${idx + 1}`}
                      className="dot-button"
                    >
                      Go to slide {idx + 1}
                    </a>
                  </li>
                ))}
            </ol>
          </aside>
        )}
      </div>
    </CarouselStyles>
  )
}
