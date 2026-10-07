export type LegalLocale = "en" | "uk";

export type LegalDocument = {
  title: string;
  body: string;
};

export const privacyDocuments: Record<LegalLocale, LegalDocument> = {
  en: {
    title: "Privacy Policy",
    body: `## 1. Who we are

Medicly (“we”, “us”) is a digital healthcare booking platform. Patients use Medicly to find doctors, see available appointment times, and book, reschedule, or cancel visits. Doctors use Medicly to manage their schedule and appointments. Medicly is a booking layer only — we do not provide medical care, diagnoses, prescriptions, or medical records.

## 2. Scope

This Privacy Policy explains what personal data we collect when you use Medicly, why we use it, how we store it, and what choices you have. It applies to the Medicly website and related in-app features available in English and Ukrainian.

## 3. Data we collect

Depending on your role and how you use Medicly, we may process:

Account and profile data — email address, password (stored as a secure hash), first and last name, role (patient or doctor), date of birth, gender, phone number, preferred language, and theme preference.

Location and clinic context — city and clinic you select (for patients, a home clinic; for doctors, where they practise).

Doctor professional data — specialty, education, experience, languages spoken, short bio, photo, consultation format (in-person / online), visit duration, working hours, days off, displayed consultation price (including any promo price), and licence or certificate file uploaded at registration (stored for account purposes; Medicly does not verify licences in MVP).

Booking data — appointments you create or manage (doctor, patient, date and time, format, optional reason for visit, status such as Upcoming, Completed, Cancelled, or Rescheduled).

Reviews and favourites — star ratings and review text you submit about doctors, and doctors you mark as favourites. Recently viewed doctors may be stored to power your cabinet widgets.

Notifications — in-app notification content related to your bookings and account activity. Medicly does not send email or SMS notifications in MVP.

Technical data — session cookies needed to keep you signed in, and basic technical logs required to run and secure the service.

We do not collect payment card details. Prices shown in Medicly are for display only; no payments are processed in the app. We do not store medical records, test results, prescriptions, or clinical notes.

## 4. Why we use your data

We process personal data to:

create and manage your account;
show honest free appointment slots and prevent double booking;
let patients book, reschedule, and cancel visits, and let doctors manage their day;
display doctor profiles, prices, ratings, and reviews;
show in-app notifications about your activity;
remember language and theme preferences;
keep accounts isolated so a patient sees only their own appointments and a doctor sees only their own calendar;
operate, secure, and improve the platform.

## 5. Legal bases (high level)

Where applicable data-protection law requires a legal basis, we rely on: performance of a contract (providing the booking service you request); consent (for example, accepting this Policy and the Terms of Use at sign-up); and legitimate interests in running a secure, reliable booking platform — balanced against your rights.

This Policy is product documentation for Medicly MVP. A broader GDPR compliance programme is outside MVP scope; if you need a formal legal review for production launch, please obtain independent counsel.

## 6. Sharing

We do not sell your personal data. We share data only as needed to operate Medicly:

between a patient and the doctor involved in a booking (so each side can see the relevant visit details);
with infrastructure providers that host or process data on our behalf under appropriate safeguards;
when required by law or to protect rights, safety, or the integrity of the service.

Doctors do not see other doctors’ calendars. Patients do not see other patients’ appointments.

## 7. Cookies and sessions

Medicly uses a session cookie (for example, to keep you logged in). Essential cookies are required for authentication and security. We do not use advertising trackers in MVP.

## 8. Retention

We keep account, booking, and related data for as long as your account is active and as needed to provide the service, resolve disputes, and meet legal obligations. When data is no longer needed, we delete or anonymise it where reasonably possible.

## 9. Security

We use appropriate technical and organisational measures, including hashed passwords, server-side access control, and database constraints that make double booking of the same slot impossible. No method of transmission or storage is fully secure; please use a strong unique password and keep your login details private.

## 10. Your choices

Depending on your account and applicable law, you may be able to:

access and update profile information in My profile;
change language and theme preferences;
cancel or reschedule eligible appointments;
submit reviews from past visits (where allowed);
stop using Medicly and request account-related deletion by contacting us through the product channels available to you.

Sign-up requires acceptance of this Privacy Policy and the Terms of Use.

## 11. Children

Medicly accounts are intended for adults who can enter into the Terms of Use. Family profiles and booking on behalf of someone else are outside MVP. Do not create an account for a child using someone else’s details in a way that misrepresents identity.

## 12. International users

Medicly is offered primarily for use in Ukraine (EN/UK UI). If you access the service from elsewhere, your data may be processed in the country where our hosting infrastructure operates.

## 13. Changes

We may update this Privacy Policy from time to time. The “Last updated” date below will change when we do. Continued use after an update means you accept the revised Policy, unless applicable law requires a different process.

## 14. Contact

For privacy questions about Medicly, use the contact options published on the platform or reach out to the team that operates your Medicly deployment.

Last updated: 7 October 2026`,
  },
  uk: {
    title: "Політика конфіденційності",
    body: `## 1. Хто ми

Medicly («ми») — цифрова платформа запису до лікаря. Пацієнти шукають лікарів, бачать вільні години та бронюють, переносять або скасовують візити. Лікарі керують своїм розкладом і прийомами. Medicly — лише шар бронювання: ми не надаємо медичну допомогу, діагнози, рецепти чи медичні картки.

## 2. Сфера дії

Ця Політика пояснює, які персональні дані ми збираємо під час користування Medicly, навіщо їх використовуємо, як зберігаємо та які у вас є можливості. Вона стосується вебсайту Medicly та пов’язаних функцій інтерфейсу англійською та українською мовами.

## 3. Які дані ми збираємо

Залежно від ролі та способу користування Medicly ми можемо обробляти:

Дані акаунта та профілю — електронну пошту, пароль (зберігається як захищений хеш), ім’я та прізвище, роль (пацієнт або лікар), дату народження, стать, номер телефону, мову інтерфейсу та тему оформлення.

Місто та клініка — обрані вами місто й клініку (для пацієнта — домашня клініка; для лікаря — місце практики).

Професійні дані лікаря — спеціальність, освіту, досвід, мови спілкування, короткий опис, фото, формат консультації (офлайн / онлайн), тривалість візиту, робочі години, вихідні, відображену ціну консультації (зокрема акційну) та файл ліцензії чи сертифіката, завантажений під час реєстрації (зберігається для акаунта; у MVP Medicly не верифікує ліцензії).

Дані бронювань — записи, які ви створюєте або керуєте (лікар, пацієнт, дата й час, формат, необов’язкова причина візиту, статус: Upcoming, Completed, Cancelled або Rescheduled).

Відгуки та обране — оцінки й тексти відгуків про лікарів, а також лікарів, доданих до обраного. Нещодавно переглянутих лікарів можна зберігати для віджетів кабінету.

Сповіщення — вміст сповіщень у застосунку щодо ваших записів і активності акаунта. У MVP Medicly не надсилає email чи SMS.

Технічні дані — сесійні cookie для входу в акаунт і базові технічні журнали, потрібні для роботи та безпеки сервісу.

Ми не збираємо дані платіжних карток. Ціни в Medicly лише показуються; оплата в застосунку не проводиться. Ми не зберігаємо медичні картки, результати аналізів, рецепти чи клінічні нотатки.

## 4. Навіщо ми використовуємо дані

Ми обробляємо персональні дані, щоб:

створювати й вести ваш акаунт;
показувати чесні вільні слоти та запобігати подвійному бронюванню;
давати пацієнтам змогу бронювати, переносити й скасовувати візити, а лікарям — керувати своїм днем;
показувати профілі лікарів, ціни, рейтинги та відгуки;
показувати сповіщення в застосунку;
запам’ятовувати мову та тему;
забезпечувати ізоляцію даних: пацієнт бачить лише свої записи, лікар — лише свій календар;
підтримувати, захищати та вдосконалювати платформу.

## 5. Правові підстави (загально)

Там, де це вимагає законодавство про захист даних, ми спираємося на: виконання договору (надання сервісу бронювання); згоду (зокрема прийняття цієї Політики та Умов використання під час реєстрації); законні інтереси в безпечній і надійній роботі платформи — з урахуванням ваших прав.

Ця Політика є продуктовою документацією для MVP Medicly. Ширша програма відповідності GDPR поза межами MVP; для промислового запуску варто отримати окрему юридичну консультацію.

## 6. Передача даних

Ми не продаємо ваші персональні дані. Передаємо їх лише настільки, наскільки це потрібно для роботи Medicly:

між пацієнтом і лікарем у межах конкретного бронювання;
постачальникам інфраструктури, які обробляють дані від нашого імені за належними гарантіями;
коли цього вимагає закон або захист прав, безпеки чи цілісності сервісу.

Лікарі не бачать календарі колег. Пацієнти не бачать записи інших пацієнтів.

## 7. Cookie та сесії

Medicly використовує сесійний cookie (зокрема, щоб ви залишалися в системі). Необхідні cookie потрібні для автентифікації та безпеки. У MVP ми не використовуємо рекламні трекери.

## 8. Зберігання

Ми зберігаємо дані акаунта, бронювань і пов’язану інформацію, доки акаунт активний і це потрібно для сервісу, вирішення спорів і виконання законних обов’язків. Коли дані більше не потрібні, ми їх видаляємо або знеособлюємо, наскільки це розумно можливо.

## 9. Безпека

Ми застосовуємо відповідні технічні й організаційні заходи, зокрема хешування паролів, перевірку доступу на сервері та обмеження в базі даних, які унеможливлюють подвійне бронювання одного слота. Жоден спосіб передачі чи зберігання не є повністю безпечним; використовуйте надійний унікальний пароль і не передавайте дані для входу іншим.

## 10. Ваші можливості

Залежно від акаунта та застосовного права ви можете:

переглядати й оновлювати профіль у «Мій профіль»;
змінювати мову та тему;
скасовувати або переносити доступні записи;
залишати відгуки після минулих візитів (де це дозволено);
припинити користування Medicly і звернутися щодо видалення акаунта через доступні канали продукту.

Під час реєстрації потрібно прийняти цю Політику конфіденційності та Умови використання.

## 11. Діти

Акаунти Medicly призначені для повнолітніх осіб, які можуть прийняти Умови використання. Сімейні профілі та запис від імені іншої особи поза MVP. Не створюйте акаунт для дитини з чужими даними так, щоб це спотворювало особу.

## 12. Міжнародні користувачі

Medicly орієнтований насамперед на використання в Україні (інтерфейс UK/EN). Якщо ви користуєтеся сервісом з іншої країни, дані можуть оброблятися там, де розміщена наша інфраструктура.

## 13. Зміни

Ми можемо оновлювати цю Політику. Дата «Останнє оновлення» нижче змінюється після правок. Подальше користування після оновлення означає прийняття зміненої Політики, якщо закон не вимагає іншого порядку.

## 14. Контакти

З питань конфіденційності Medicly користуйтеся контактами, опублікованими на платформі, або звертайтеся до команди, яка обслуговує ваше розгортання Medicly.

Останнє оновлення: 7 жовтня 2026`,
  },
};
