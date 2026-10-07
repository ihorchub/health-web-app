import type { LegalDocument, LegalLocale } from "./privacy.js";

export const termsDocuments: Record<LegalLocale, LegalDocument> = {
  en: {
    title: "Terms of Use",
    body: `## 1. Agreement

These Terms of Use (“Terms”) govern access to and use of Medicly, a digital healthcare booking platform. By creating an account, checking the consent boxes at sign-up, or using Medicly, you agree to these Terms and to our Privacy Policy.

If you do not agree, do not use Medicly.

## 2. What Medicly is

Medicly helps patients find doctors, view real available appointment times, and book, reschedule, or cancel visits. Doctors manage their own working hours and appointments. Medicly is a booking layer only.

Medicly does not provide medical advice, diagnosis, treatment, prescriptions, medical records, insurance services, or payment processing. Displayed prices are informational; no fees are charged through the app in MVP.

## 3. Eligibility and accounts

You must provide accurate registration information. One email address corresponds to one role: either patient or doctor. You are responsible for keeping your password confidential and for activity under your account.

Doctor registration may require uploading a licence or certificate. In MVP, Medicly stores this file for the account and does not perform licence verification.

We may suspend or close accounts that violate these Terms, misuse the platform, or put other users at risk.

## 4. Patient use

As a patient you may search for doctors, view profiles, favourites, ratings and reviews, book free slots within the rolling bookable window, and manage your own appointments (cancel or reschedule when the product rules allow).

You must not book slots you do not intend to use in a way that systematically blocks others, impersonate another person, or attempt to access another patient’s data.

Optional “reason for visit” text is for coordination with the doctor only — it is not a medical record.

## 5. Doctor use

As a doctor you may set working hours, visit duration, days off, supported formats, and displayed prices (including promotional prices), and manage visits on your calendar (for example mark completed or cancel when allowed).

You see only your own schedule and related patient booking details. You must keep profile information reasonably accurate and must not use Medicly to harass patients or misuse their data.

## 6. Bookings, honesty of slots, and conflicts

Free times shown in Medicly are derived from a doctor’s working hours minus taken slots, breaks, days off, and past times. A slot can be taken by only one patient. If two people try to book the same slot at the same moment, one booking succeeds and the other receives a clear refusal.

Appointment statuses used in MVP include Upcoming, Completed, Cancelled, and Rescheduled. Final statuses do not move further. Specific cancel and reschedule cut-offs follow the product rules shown in the interface.

## 7. Reviews and ratings

Where enabled, patients may leave a star rating and review after eligible past visits. Reviews should be honest and lawful. Do not post defamatory, abusive, or illegal content. Medicly may remove content that violates these Terms. Broader review moderation workflows may evolve beyond MVP.

## 8. Notifications

Medicly provides in-app notifications (for example via the bell). Email and SMS reminders are outside MVP. You are responsible for checking your cabinet and notifications for booking changes.

## 9. Intellectual property

Medicly branding, interface, and platform content (excluding your own user content) belong to Medicly or its licensors. You may not copy, scrape, or reverse engineer the service except as allowed by law.

You grant Medicly a limited licence to host and display content you submit (such as profile text, reviews, and licence files) solely to operate the service.

## 10. Acceptable use

You agree not to:

attempt unauthorised access to accounts, data, or systems;
interfere with slot integrity, availability, or security;
upload malware or harmful files;
use Medicly for unlawful purposes;
misrepresent your identity or professional credentials.

## 11. Disclaimers

Medicly is provided “as is” and “as available” for MVP use. We do not warrant uninterrupted availability, that every third-party clinic process will match the app, or that displayed doctor information is complete for clinical decision-making. Always follow the doctor’s and clinic’s instructions for care.

To the fullest extent permitted by law, Medicly is not liable for medical outcomes, missed appointments caused by user error or network issues outside our reasonable control, or disputes between patients and doctors about care delivered offline or online outside the booking confirmation itself.

## 12. Limitation of liability

Where liability cannot be excluded, Medicly’s aggregate liability arising from these Terms or your use of the service is limited to the greater of (a) zero, because no payments are taken in-app in MVP, or (b) any mandatory minimum under applicable law. Nothing in these Terms limits liability that cannot legally be limited.

## 13. Changes

We may update these Terms. The “Last updated” date will change when we do. Material changes may be highlighted in the product when practical. Continued use after an update constitutes acceptance, unless law requires otherwise.

## 14. Contact

Questions about these Terms can be sent through the contact options published on Medicly or to the team operating your deployment.

Last updated: 7 October 2026`,
  },
  uk: {
    title: "Умови використання",
    body: `## 1. Угода

Ці Умови використання («Умови») регулюють доступ до Medicly — цифрової платформи запису до лікаря — та користування нею. Створюючи акаунт, ставлячи позначки згоди під час реєстрації або користуючись Medicly, ви приймаєте ці Умови та нашу Політику конфіденційності.

Якщо ви не згодні — не користуйтеся Medicly.

## 2. Що таке Medicly

Medicly допомагає пацієнтам знаходити лікарів, бачити реальні вільні години та бронювати, переносити або скасовувати візити. Лікарі керують своїми робочими годинами та прийомами. Medicly — лише шар бронювання.

Medicly не надає медичних порад, діагнозів, лікування, рецептів, медичних карток, страхових послуг і не проводить оплату. Показані ціни мають інформаційний характер; у MVP через застосунок кошти не стягуються.

## 3. Право на користування та акаунти

Ви маєте надавати точні дані під час реєстрації. Одна електронна пошта відповідає одній ролі: пацієнт або лікар. Ви відповідаєте за конфіденційність пароля та за дії в межах свого акаунта.

Реєстрація лікаря може вимагати завантаження ліцензії чи сертифіката. У MVP Medicly зберігає цей файл для акаунта і не проводить верифікацію ліцензії.

Ми можемо призупинити або закрити акаунти, які порушують ці Умови, зловживають платформою або створюють ризик для інших користувачів.

## 4. Користування пацієнтом

Як пацієнт ви можете шукати лікарів, переглядати профілі, обране, рейтинги й відгуки, бронювати вільні слоти в межах рухомого вікна запису та керувати своїми записами (скасовувати або переносити, коли правила продукту це дозволяють).

Заборонено системно блокувати чужі слоти записами без наміру прийти, видавати себе за іншу особу або намагатися отримати доступ до даних іншого пацієнта.

Необов’язковий текст «причина візиту» потрібен лише для координації з лікарем — це не медична картка.

## 5. Користування лікарем

Як лікар ви можете налаштовувати робочі години, тривалість візиту, вихідні, підтримувані формати та відображені ціни (зокрема акційні), а також керувати візитами в календарі (наприклад, позначити завершеним або скасувати, коли це дозволено).

Ви бачите лише свій розклад і пов’язані дані бронювання пацієнта. Профіль має бути достатньо точним; заборонено використовувати Medicly для цькування пацієнтів або зловживання їхніми даними.

## 6. Бронювання, чесність слотів і конфлікти

Вільний час у Medicly формується з робочих годин лікаря мінус зайняті слоти, перерви, вихідні та минулий час. Один слот може зайняти лише один пацієнт. Якщо двоє людей намагаються забронювати той самий слот одночасно, одне бронювання успішне, друге отримує зрозумілу відмову.

Статуси записів у MVP: Upcoming, Completed, Cancelled і Rescheduled. Фінальні статуси далі не змінюються. Конкретні обмеження на скасування та перенесення відповідають правилам, показаним в інтерфейсі.

## 7. Відгуки та рейтинги

Де це увімкнено, пацієнти можуть залишити оцінку та відгук після відповідних минулих візитів. Відгуки мають бути чесними й законними. Не публікуйте наклепницький, образливий або незаконний контент. Medicly може видаляти матеріали, що порушують ці Умови. Ширші процеси модерації можуть розвиватися після MVP.

## 8. Сповіщення

Medicly надає сповіщення в застосунку (наприклад, через дзвіночок). Email- та SMS-нагадування поза MVP. Ви відповідаєте за перевірку кабінету та сповіщень щодо змін у записах.

## 9. Інтелектуальна власність

Бренд Medicly, інтерфейс і контент платформи (окрім вашого власного контенту користувача) належать Medicly або ліцензіарам. Заборонено копіювати, парсити чи зламувати сервіс, крім випадків, дозволених законом.

Ви надаєте Medicly обмежену ліцензію розміщувати й показувати поданий вами контент (текст профілю, відгуки, файли ліцензії) виключно для роботи сервісу.

## 10. Прийнятне використання

Ви зобов’язуєтеся не:

намагатися отримати несанкціонований доступ до акаунтів, даних чи систем;
втручатися в цілісність слотів, доступність або безпеку;
завантажувати шкідливе програмне забезпечення;
використовувати Medicly незаконно;
спотворювати особу чи професійні дані.

## 11. Відмова від гарантій

Medicly надається «як є» та «як доступно» для MVP. Ми не гарантуємо безперервну доступність, повну відповідність усіх процесів сторонніх клінік застосунку чи повноту інформації про лікаря для клінічних рішень. Завжди дотримуйтеся вказівок лікаря та клініки щодо медичної допомоги.

Наскільки дозволяє закон, Medicly не відповідає за медичні результати, пропущені візити через помилку користувача чи мережеві збої поза нашим розумним контролем, або спори між пацієнтами й лікарями щодо допомоги поза самим підтвердженням бронювання.

## 12. Обмеження відповідальності

Там, де відповідальність не можна виключити, сукупна відповідальність Medicly за цими Умовами або користуванням сервісом обмежується більшим із: (a) нулем, бо в MVP оплата в застосунку не стягується, або (b) обов’язковим мінімумом за законом. Ніщо в цих Умовах не обмежує відповідальність, яку закон не дозволяє обмежувати.

## 13. Зміни

Ми можемо оновлювати ці Умови. Дата «Останнє оновлення» змінюється після правок. Істотні зміни можуть бути позначені в продукті, коли це практично. Подальше користування після оновлення означає прийняття, якщо закон не вимагає іншого.

## 14. Контакти

Питання щодо цих Умов можна надсилати через контакти, опубліковані в Medicly, або команді, яка обслуговує ваше розгортання.

Останнє оновлення: 7 жовтня 2026`,
  },
};
