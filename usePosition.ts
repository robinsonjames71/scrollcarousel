import {
  useEffect,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from 'react'
import type { HTMLDivElementWithTimeout } from './ScrollCarousel'

const scrollViewport = ({ viewportRef, slideRef, navigateTo }) => {
  const scrollableAmount =
    viewportRef.current.scrollWidth - viewportRef.current.offsetWidth
  const scrollableScale = scrollableAmount / viewportRef.current.scrollWidth

  const slidesCenterPosScale = slideRef.current.map((el, idx) => {
    if (idx === 0) {
      return 0
    }
    if (idx === slideRef.current.length - 1) {
      return scrollableAmount
    }
    return (el.offsetLeft + el.offsetWidth / 2) * scrollableScale
  })

  viewportRef.current.scrollLeft = Math.floor(slidesCenterPosScale[navigateTo])
}

export const usePosition = ({
  scrolling,
  initialSlide,
  gapBetweenSlides,
  viewportRef,
  slideRef,
  setActiveSlide,
}: {
  scrolling: boolean
  initialSlide: number
  gapBetweenSlides: number
  viewportRef: RefObject<HTMLDivElementWithTimeout>
  slideRef: RefObject<HTMLDivElement[]>
  setActiveSlide: Dispatch<SetStateAction<number>>
}) => {
  const notScrollable =
    viewportRef.current?.offsetWidth === viewportRef.current?.scrollWidth
  // Set the active slide and scroll position based on the initialSlide prop
  useEffect(() => {
    if (initialSlide > 1 && !notScrollable) {
      scrollViewport({
        viewportRef,
        slideRef,
        navigateTo: initialSlide - 1,
      })
    }
  }, [initialSlide, slideRef, viewportRef, notScrollable])

  // Set the active slide based on the scroll position
  useEffect(() => {
    if (!scrolling && !notScrollable) {
      const getActiveSlide = () => {
        if (viewportRef.current) {
          const position = viewportRef.current.scrollLeft

          const scrollableAmount =
            viewportRef.current.scrollWidth - viewportRef.current.offsetWidth
          const scrollableScale =
            scrollableAmount / viewportRef.current.scrollWidth

          const slidesCenterPosScale = slideRef.current.map((el, idx) => {
            if (idx === 0) {
              return 0
            }
            if (idx === slideRef.current.length - 1) {
              return scrollableAmount
            }
            return (el.offsetLeft + el.offsetWidth / 2) * scrollableScale
          })
          const closest = slidesCenterPosScale.reduce((prev, curr) =>
            Math.abs(curr - position) < Math.abs(prev - position) ? curr : prev,
          )
          const activeSlide = slidesCenterPosScale.findIndex(
            (pos) => pos === closest,
          )

          return activeSlide
        }
        return initialSlide === 0 ? 0 : initialSlide - 1
      }

      clearTimeout(viewportRef.current.scrollTimeout) //clear previous timeout

      viewportRef.current.scrollTimeout = setTimeout(function () {
        setActiveSlide(getActiveSlide())
        // 150ms is the time to wait before the scroll snap stops
      }, 150)
    }
  }, [
    scrolling,
    gapBetweenSlides,
    initialSlide,
    setActiveSlide,
    slideRef,
    viewportRef,
    notScrollable,
  ])
}

// Handle clicking the previous btn in the navigation
export const prevHandler = ({
  viewportRef,
  scrolling,
  activeSlide,
  slideRef,
  setActiveSlide,
}: {
  scrolling: boolean
  activeSlide: number
  viewportRef: RefObject<HTMLDivElementWithTimeout>
  slideRef: RefObject<HTMLDivElement[]>
  setActiveSlide: Dispatch<SetStateAction<number>>
}) => {
  const notScrollable =
    viewportRef.current?.offsetWidth === viewportRef.current?.scrollWidth
  if (!scrolling && Array.isArray(slideRef.current)) {
    if (!viewportRef.current) return
    const prevLink = (() => {
      // If at the start of the scrollable viewport, then the previous slide should be the last slide
      if (!notScrollable && viewportRef.current.scrollLeft === 0) {
        return slideRef.current.length - 1
      }
      return activeSlide === 0 ? slideRef.current.length - 1 : activeSlide - 1
    })()

    setActiveSlide(prevLink)

    if (!notScrollable) {
      scrollViewport({
        viewportRef,
        slideRef,
        navigateTo: prevLink,
      })
    }

    // if (viewportRef.current.scrollLeft === 0) {
    //   setActiveSlide(0)
    // } else {
    //   setActiveSlide(prevLink)
    // }
  }
}

// Handle clicking the next btn in the navigation
export const nextHandler = ({
  viewportRef,
  scrolling,
  activeSlide,
  slideRef,
  setActiveSlide,
}: {
  scrolling: boolean
  activeSlide: number
  viewportRef: RefObject<HTMLDivElementWithTimeout>
  slideRef: RefObject<HTMLDivElement[]>
  setActiveSlide: Dispatch<SetStateAction<number>>
}) => {
  const notScrollable =
    viewportRef.current?.offsetWidth === viewportRef.current?.scrollWidth

  if (!scrolling && Array.isArray(slideRef.current)) {
    if (!viewportRef.current) return
    const nextLink = (() => {
      // If at the end of the scrollable viewport, then the next slide should be the first slide
      if (
        !notScrollable &&
        viewportRef.current.scrollLeft + viewportRef.current.clientWidth ===
          viewportRef.current.scrollWidth
      ) {
        return 0
      }
      return activeSlide === slideRef.current.length - 1 ? 0 : activeSlide + 1
    })()

    setActiveSlide(nextLink)

    if (!notScrollable) {
      scrollViewport({
        viewportRef,
        slideRef,
        navigateTo: nextLink,
      })
    }
  }
}
