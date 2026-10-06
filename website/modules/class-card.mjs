/** UI component: textContent prevents class/trainer names being interpreted as HTML. */
export function createClassCard(summary, result, onRequest) {
  const article = document.createElement('article');
  article.className = 'cfj-class-card';
  const heading = document.createElement('h2');
  heading.textContent = summary.name;
  const details = document.createElement('p');
  details.textContent = `${summary.trainer} · ${summary.spaces} space${summary.spaces === 1 ? '' : 's'} available`;
  const status = document.createElement('p');
  const labels = {
    READY: 'Ready to request — a place is confirmed only after a server response.',
    OFFLINE: 'Connect to the internet to request a place.',
    SIGN_IN_REQUIRED: 'Sign in to request a place.',
    ALREADY_BOOKED: 'You have already booked this class.',
    FULL: 'This class is full.',
    INVALID_CAPACITY: 'Availability is not available. Please refresh.',
    INVALID_BOOKING_STATE: 'Booking status is not available. Please refresh.'
  };
  status.textContent = labels[result] || 'Booking is unavailable.';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Request place';
  button.disabled = result !== 'READY';
  button.setAttribute('aria-label', `Request a place in ${summary.name}`);
  button.addEventListener('click', () => onRequest(summary.id));
  article.append(heading, details, status, button);
  return article;
}
