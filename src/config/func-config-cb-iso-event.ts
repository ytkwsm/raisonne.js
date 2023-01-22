export default function(entries: IntersectionObserverEntry[]) {
  entries.forEach(entry => {
      if (entry.isIntersecting) {
          // do something when the element is intersecting
          console.log(entry.target);
      }
  });
}