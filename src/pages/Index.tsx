import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

const PHOTO_HERO = 'https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/f8023fbe-5972-4d0a-9de8-975b411fa0fa.jpg';
const PHOTO_ABOUT_1 = 'https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/9a18b6be-471b-434f-83ca-c4a47dd3ed78.png';
const PHOTO_ABOUT_2 = 'https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/e3383e45-4b36-41f0-8304-8f1de0901248.png';
const LOGO = 'https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/147040bb-39b2-46b1-af51-38358912e677.png';

type FormState = {
  name: string;
  company: string;
  phone: string;
  channel: string;
  email: string;
  time: string;
  city: string;
  interest: string;
};
const EMPTY_FORM: FormState = {
  name: '', company: '', phone: '', channel: '', email: '', time: '', city: '', interest: '',
};

const CHANNELS = [
  { value: 'call', label: 'Звонок', icon: 'Phone' },
  { value: 'telegram', label: 'Telegram', icon: 'Send' },
  { value: 'max', label: 'MAX', icon: 'MessageCircle' },
  { value: 'email', label: 'Email', icon: 'Mail' },
];

const TEAM_SIZES = [
  { value: 'lt5', label: 'Менее 5' },
  { value: '5-7', label: '5–7' },
  { value: '8-15', label: '8–15' },
  { value: '16+', label: '16 и больше' },
];

const SITUATIONS = [
  'клиент говорит «дорого»',
  'появляется конкурент',
  'закупщик давит на цену',
  'клиент требует скидку',
  'привычный скрипт перестаёт работать',
  'нужно самому вести разговор, а не читать заготовку',
];

const STAGES = [
  { icon: 'Handshake', title: 'Контакт', text: 'Как менеджер начинает разговор и получает право на следующий вопрос.' },
  { icon: 'Search', title: 'Диагностика', text: 'Умеет ли он понять реальный интерес клиента или сразу начинает рассказывать о товаре.' },
  { icon: 'Package', title: 'Предложение', text: 'Как переводит характеристики продукта в коммерческую ценность.' },
  { icon: 'Tag', title: 'Цена', text: 'Что происходит после первого «дорого».' },
  { icon: 'ShieldAlert', title: 'Возражения', text: 'Начинает ли оправдываться, отдавать скидку или способен продолжать переговоры.' },
  { icon: 'Compass', title: 'Позиция', text: 'Кто ведёт переговоры, а кто отдаёт управление клиенту.' },
];

const OWNER_WHO = [
  'способен вести сложные переговоры',
  'работает по шаблону',
  'теряется под давлением',
  'слишком быстро отдаёт цену',
  'умеет удерживать позицию',
];

const OWNER_WHERE = [
  'ломается алгоритм продажи',
  'теряется ценность продукта',
  'возникает зависимость от скидки',
  'команда перестаёт управлять разговором',
];

const CHAIN = ['интерес клиента', 'потребность', 'ценность', 'позиция', 'переговоры', 'следующий шаг'];

const FIT = [
  'Компания работает с B2B-клиентами',
  'В отделе от 5 менеджеров',
  'Есть РОП или коммерческий директор',
  'Уже существует структура продаж',
  'Есть заданный алгоритм работы с клиентом',
  'Менеджеры регулярно ведут реальные переговоры',
  'Руководитель действительно хочет увидеть, что происходит внутри отдела',
];

const AFTER_PILOT = [
  { icon: 'Repeat', title: 'Полигон раз в неделю', text: 'Регулярная переговорная практика с командой.' },
  { icon: 'Workflow', title: 'Разбор алгоритма продаж', text: 'Если проблема оказалась не только в менеджерах, а в самой логике продажи.' },
  { icon: 'RefreshCw', title: 'Перезагрузка отдела', text: 'Продукт → оффер → переговоры → реальные контакты с рынком.' },
];

const ABOUT_TAGS = ['B2B', 'Продукт', 'Коммерция', 'Переговоры'];

const DIPLOMAS = [
  { src: 'https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/87bc895e-e2f9-49b0-8f94-802cd51e4289.jpg', caption: 'Диплом, 2025' },
  { src: 'https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/790ccbdf-465d-4ecb-93cc-d817d18cdcb5.jpg', caption: 'Сертификат, 2013' },
];

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView(0.08);
  return (
    <div ref={ref} className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
      style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

const CARD_STYLE = { background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.14)' };
const ALT_BG = { borderTop: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(180deg, #0A0A0A 0%, #111 100%)' };
const LINE_TOP = { borderTop: '1px solid rgba(201,169,110,0.1)' };

function isFormValid(form: FormState) {
  return form.name.trim() !== '' && form.company.trim() !== '' && form.phone.trim() !== '';
}

async function sendLead(form: FormState, type: string) {
  try {
    const channelLabel = CHANNELS.find(c => c.value === form.channel)?.label || '—';
    const sizeLabel = TEAM_SIZES.find(i => i.value === form.interest)?.label || '—';
    const res = await fetch('https://functions.poehali.dev/fc323d06-bbf9-4e34-b478-9a1d63552d0d', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        company: form.company,
        city: form.city,
        message: `Канал связи: ${channelLabel}. Email: ${form.email || '—'}. Время связи: ${form.time || '—'}. Менеджеров в отделе: ${sizeLabel}.`,
        type,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function LeadFields({ form, setForm, wide }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>>; wide?: boolean }) {
  const span = wide ? 'md:col-span-2' : '';
  return (
    <>
      <input className="input-dark rounded-sm px-4 py-3 text-sm w-full" placeholder="ФИО *" required
        value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
      <input className="input-dark rounded-sm px-4 py-3 text-sm w-full" placeholder="Компания *" required
        value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
      <input className="input-dark rounded-sm px-4 py-3 text-sm w-full" placeholder="Телефон *" required
        value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
      <input className="input-dark rounded-sm px-4 py-3 text-sm w-full" placeholder="Город"
        value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />

      <div className={span}>
        <p className="text-white/40 text-xs tracking-wide uppercase mb-2">Сколько менеджеров в отделе продаж</p>
        <div className="flex flex-wrap gap-2">
          {TEAM_SIZES.map(i => (
            <button key={i.value} type="button" onClick={() => setForm(p => ({ ...p, interest: i.value }))}
              className="px-3 py-2 rounded-sm text-xs transition-colors"
              style={{
                background: form.interest === i.value ? 'rgba(201,169,110,0.18)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${form.interest === i.value ? 'rgba(201,169,110,0.7)' : 'rgba(201,169,110,0.25)'}`,
                color: form.interest === i.value ? '#e8d5a3' : 'rgba(245,240,232,0.7)',
              }}>
              {i.label}
            </button>
          ))}
        </div>
      </div>

      <div className={span}>
        <p className="text-white/40 text-xs tracking-wide uppercase mb-2">Приоритетный канал связи</p>
        <div className="flex flex-wrap gap-2">
          {CHANNELS.map(c => (
            <button key={c.value} type="button" onClick={() => setForm(p => ({ ...p, channel: c.value }))}
              className="flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs transition-colors"
              style={{
                background: form.channel === c.value ? 'rgba(201,169,110,0.18)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${form.channel === c.value ? 'rgba(201,169,110,0.7)' : 'rgba(201,169,110,0.25)'}`,
                color: form.channel === c.value ? '#e8d5a3' : 'rgba(245,240,232,0.7)',
              }}>
              <Icon name={c.icon} size={13} />
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {form.channel === 'email' && (
        <input className="input-dark rounded-sm px-4 py-3 text-sm w-full" placeholder="Email"
          type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
      )}

      <input className="input-dark rounded-sm px-4 py-3 text-sm w-full" placeholder="Удобное время для связи"
        value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
    </>
  );
}

function Modal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await sendLead(form, 'Рыночный тест · 9 000 ₽');
    setSent(true);
    setLoading(false);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto"
        style={{ background: '#0e0e0e', border: '1px solid rgba(201,169,110,0.35)', borderRadius: 2 }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
          <Icon name="X" size={20} />
        </button>
        {sent ? (
          <div className="p-10 text-center">
            <div className="text-5xl mb-4">🤝</div>
            <p className="font-cormorant text-2xl gold-text mb-2">Заявка принята</p>
            <p className="text-white/60 font-golos text-sm">Андрей посмотрит, подходит ли ваша команда под формат, и напишет вам лично</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-4">
            <h3 className="font-cormorant text-2xl text-off-white mb-1">
              Заявка на рыночный тест
            </h3>
            <p className="text-white/50 text-sm font-golos mb-2">
              Расскажите о компании и отделе продаж — я посмотрю, подходит ли ваша команда под формат
            </p>
            <LeadFields form={form} setForm={setForm} />
            <button type="submit" disabled={loading || !isFormValid(form)} className="btn-gold rounded py-3 text-sm mt-2 disabled:opacity-40">
              {loading ? 'Отправляем...' : 'Подать заявку'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await sendLead(form, 'bottom');
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-4">🤝</div>
        <p className="font-cormorant text-2xl gold-text mb-2">Заявка принята</p>
        <p className="text-white/50 text-sm">Андрей посмотрит, подходит ли ваша команда под формат, и напишет вам лично</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
      <LeadFields form={form} setForm={setForm} wide />
      <div className="md:col-span-2">
        <button type="submit" disabled={loading || !isFormValid(form)}
          className="btn-gold rounded-sm py-4 px-12 text-sm tracking-wider uppercase disabled:opacity-40">
          {loading ? 'Отправляем...' : 'Подать заявку'}
        </button>
      </div>
    </form>
  );
}

function SectionTitle({ eyebrow, children }: { eyebrow?: string; children: React.ReactNode }) {
  return (
    <div className="text-center mb-12">
      {eyebrow && <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">{eyebrow}</p>}
      <h2 className="font-cormorant text-3xl md:text-5xl text-off-white font-light leading-tight">{children}</h2>
      <div className="section-divider mt-6" />
    </div>
  );
}

export default function Index() {
  const [modalOpen, setModalOpen] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const hero = useInView(0.05);

  const openModal = () => setModalOpen(true);

  useEffect(() => {
    const interval = setInterval(() => setPhotoIdx(i => (i + 1) % 2), 5000);
    return () => clearInterval(interval);
  }, []);

  const aboutPhotos = [PHOTO_ABOUT_1, PHOTO_ABOUT_2];

  return (
    <div className="min-h-screen bg-obsidian text-off-white font-golos overflow-x-hidden">
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} />

      {lightbox && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 cursor-zoom-out"
          style={{ background: 'rgba(0,0,0,0.92)' }} onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white" onClick={() => setLightbox(null)}>
            <Icon name="X" size={26} />
          </button>
          <img src={lightbox} alt="Документ об образовании" className="max-w-full max-h-[90vh] object-contain" />
        </div>
      )}

      {/* ШАПКА */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-4"
        style={{ background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
        <div className="flex flex-col items-center gap-1 whitespace-nowrap">
          <img src={LOGO} alt="Бизнес-игры by Doroshenko" className="h-14 w-14 md:h-16 md:w-16 rounded-full object-cover" />
          <span className="font-cormorant text-lg md:text-xl tracking-widest uppercase gold-text hidden sm:inline">
            ДОРОШЕНКО
          </span>
        </div>
        <nav className="hidden lg:flex gap-6 text-xs text-white/40 tracking-widest uppercase">
          <a href="#test" className="hover:text-white transition-colors">Что тестируем</a>
          <a href="#owner" className="hover:text-white transition-colors">Результат</a>
          <a href="#format" className="hover:text-white transition-colors">Формат</a>
          <a href="#about" className="hover:text-white transition-colors">Обо мне</a>
          <a href="#contact" className="hover:text-white transition-colors">Контакты</a>
        </nav>
        <button onClick={openModal}
          className="text-xs tracking-widest uppercase gold-text hover:opacity-70 transition-opacity border border-gold/30 px-4 py-2 hidden md:block">
          Подать заявку
        </button>
        <a href="tel:89206200034" className="text-sm gold-text hover:opacity-80 transition-opacity font-medium md:hidden">
          8 920 620-00-34
        </a>
      </header>

      {/* HERO */}
      <section ref={hero.ref} className="relative min-h-screen flex items-stretch overflow-hidden pt-16">
        <div className="relative z-10 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-20 w-full md:w-1/2">
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(201,169,110,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.025) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
          <div className="relative z-10 max-w-xl">
            <p className={`text-[11px] tracking-[0.25em] uppercase text-gold/70 mb-3 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Рыночный тест авторской технологии диагностики продаж
            </p>
            <p className={`inline-flex items-center gap-2 text-xs tracking-wide text-gold border border-gold/30 px-3 py-1.5 mb-8 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '0.1s' }}>
              <Icon name="CalendarDays" size={13} />
              5 компаний в Санкт-Петербурге · октябрь
            </p>

            <h1 className={`font-cormorant font-light leading-[1.1] mb-5 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ fontSize: 'clamp(1.8rem, 3.6vw, 3.1rem)', transitionDelay: '0.2s' }}>
              CRM работает.<br />Скрипты написаны.<br />Алгоритм продаж утверждён.<br />
              <span className="gold-gradient">А что происходит, когда менеджер остаётся один на один с клиентом?</span>
            </h1>

            <p className={`text-white/75 text-[15px] md:text-base leading-relaxed mb-3 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '0.28s' }}>
              Я создал переговорный полигон, чтобы это увидеть. Не тренинг. Не лекция. Не игра ради игры.
            </p>
            <p className={`text-white/60 text-[14px] leading-relaxed mb-8 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '0.34s' }}>
              5 часов плотной практики с вашим отделом продаж. На выходе собственник получает срез команды и рекомендации, а менеджеры проходят реальные переговорные ситуации через другой коммерческий угол.
            </p>

            <div className={`flex flex-col sm:flex-row sm:items-center gap-5 mb-6 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '0.5s' }}>
              <button onClick={openModal} className="btn-gold px-8 py-4 text-sm tracking-wider uppercase rounded-sm">
                Подать заявку на тест
              </button>
              <p className="text-off-white">
                <span className="font-cormorant text-3xl gold-text font-semibold">9 000 ₽</span>
                <span className="block text-xs text-white/50">участие в рыночном тесте</span>
              </p>
            </div>

            <p className={`flex items-center gap-2 text-gold/80 text-xs tracking-wide transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '0.6s' }}>
              <Icon name="MapPin" size={14} className="shrink-0" />
              Санкт-Петербург · на вашей территории или выбранной площадке
            </p>
          </div>
        </div>

        <div className="hidden md:block absolute right-0 top-16 bottom-0 w-1/2">
          <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to right, #0A0A0A 0%, transparent 35%)' }} />
          <img src={PHOTO_HERO} alt="Андрей Дорошенко" className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.85) contrast(1.05)', objectPosition: 'top' }} />
          <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to top, #0A0A0A 0%, transparent 40%)' }} />
        </div>
      </section>

      {/* ЧТО ТЕСТИРУЕМ */}
      <section id="test" className="py-24 px-6 md:px-16 lg:px-24" style={ALT_BG}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <SectionTitle eyebrow="Что мы тестируем">
              CRM показывает, что произошло со сделкой.<br /><span className="gold-text">Но не показывает, почему менеджер потерял клиента</span>
            </SectionTitle>
            <p className="text-white/60 text-[15px] md:text-lg leading-relaxed text-center max-w-2xl mx-auto mb-4">
              Обычно руководитель видит продажи через CRM, отчёты и цифры. На полигоне мы смотрим на другое: как менеджер думает и действует в момент переговоров.
            </p>
            <div className="text-center">
              <a href="https://t.me/adprodmarketing" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 text-sm tracking-wide rounded-sm border border-gold/30 gold-text hover:bg-gold/10 transition-colors">
                <Icon name="Send" size={16} />
                Подписаться на телеграм-канал «Дорошенко — бизнес-игры»
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-14">
            <p className="text-center text-white/50 text-sm tracking-wide uppercase mb-6">Что происходит, когда:</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {SITUATIONS.map((s, i) => (
                <div key={i} className="p-5 rounded-sm flex items-center gap-3" style={CARD_STYLE}>
                  <Icon name="Minus" size={16} className="text-gold shrink-0" />
                  <p className="text-white/75 text-sm">{s}</p>
                </div>
              ))}
            </div>
            <p className="text-center font-cormorant text-2xl gold-text mt-10">
              Вот здесь и проявляется реальная модель продаж.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 5 ЧАСОВ */}
      <section className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <SectionTitle eyebrow="5 часов. Один отдел. Много живых ситуаций">
              Мы создаём условия, в которых видно, как они продают сейчас
            </SectionTitle>
            <p className="text-white/60 text-[15px] md:text-lg leading-relaxed text-center max-w-2xl mx-auto mb-12">
              Мы не рассказываем менеджерам, как надо продавать. Команда проходит переговорные ситуации, построенные вокруг вашей коммерческой реальности. Смотрим:
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STAGES.map((s, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="p-7 rounded-sm h-full" style={CARD_STYLE}>
                  <Icon name={s.icon} size={26} className="text-gold mb-4" />
                  <p className="font-cormorant text-xl gold-text uppercase tracking-wider mb-2">{s.title}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* СОБСТВЕННИК */}
      <section id="owner" className="py-24 px-6 md:px-16 lg:px-24" style={ALT_BG}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <SectionTitle eyebrow="Что получает собственник">
              Не ещё один отчёт.<br /><span className="gold-text">А срез отдела продаж</span>
            </SectionTitle>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-4">
            <Reveal>
              <div className="p-7 rounded-sm h-full" style={CARD_STYLE}>
                <p className="font-cormorant text-2xl gold-text mb-4">Кто</p>
                <ul className="flex flex-col gap-3">
                  {OWNER_WHO.map((t, i) => (
                    <li key={i} className="flex gap-2 text-white/65 text-sm">
                      <Icon name="ChevronRight" size={15} className="text-gold shrink-0 mt-0.5" />{t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="p-7 rounded-sm h-full" style={CARD_STYLE}>
                <p className="font-cormorant text-2xl gold-text mb-4">Где</p>
                <ul className="flex flex-col gap-3">
                  {OWNER_WHERE.map((t, i) => (
                    <li key={i} className="flex gap-2 text-white/65 text-sm">
                      <Icon name="ChevronRight" size={15} className="text-gold shrink-0 mt-0.5" />{t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="p-7 rounded-sm h-full" style={CARD_STYLE}>
                <p className="font-cormorant text-2xl gold-text mb-4">Что делать</p>
                <p className="text-white/65 text-sm leading-relaxed">
                  Собственник и РОП получают конкретные рекомендации по дальнейшей работе с командой и алгоритмом продаж.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* МЕНЕДЖЕРЫ */}
      <section className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <SectionTitle eyebrow="Что получают менеджеры">
              Не очередную презентацию на 120 слайдов
            </SectionTitle>
            <p className="text-white/60 text-[15px] md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
              5 часов практики. Они пробуют другую логику построения сделки:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {CHAIN.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="px-4 py-2 rounded-sm text-sm text-off-white" style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)' }}>{c}</span>
                  {i < CHAIN.length - 1 && <Icon name="ArrowRight" size={16} className="text-gold/60" />}
                </div>
              ))}
            </div>
            <p className="text-white/60 text-[15px] leading-relaxed max-w-2xl mx-auto">
              Задача не в том, чтобы заменить один скрипт другим. Задача — открыть менеджеру другой способ думать о продаже.
            </p>
          </Reveal>
        </div>
      </section>

      {/* А ЧТО ПОЛУЧАЮ Я */}
      <section className="py-24 px-6 md:px-16 lg:px-24" style={ALT_BG}>
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <SectionTitle eyebrow="А что получаю я?">
              Тоже честно
            </SectionTitle>
            <p className="text-white/65 text-[15px] md:text-lg leading-relaxed mb-4">
              Я вывожу авторскую технологию на рынок и сейчас проверяю её на реальных B2B-командах. Мне нужны 5 компаний в Санкт-Петербурге, чтобы пройти этот этап вместе с разными продуктами, рынками и отделами продаж.
            </p>
            <p className="text-white/65 text-[15px] md:text-lg leading-relaxed mb-8">
              Поэтому сейчас компания участвует в тесте по специальной цене:
            </p>
            <p className="font-cormorant text-6xl gold-text font-semibold mb-4">9 000 ₽</p>
            <p className="text-white/50 text-sm">
              Это не «скидка на тренинг». Это цена участия в рыночном тесте технологии.
            </p>
          </Reveal>
        </div>
      </section>

      {/* КОМУ ПОДХОДИТ + ФОРМАТ */}
      <section id="format" className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <SectionTitle eyebrow="Кому подходит полигон">
              Ваш отдел подходит, если:
            </SectionTitle>
          </Reveal>
          <div className="grid md:grid-cols-5 gap-6">
            <Reveal className="md:col-span-3">
              <div className="p-7 rounded-sm h-full" style={CARD_STYLE}>
                <ul className="flex flex-col gap-3">
                  {FIT.map((t, i) => (
                    <li key={i} className="flex gap-3 text-white/75 text-sm">
                      <Icon name="Check" size={17} className="text-gold shrink-0 mt-0.5" />{t}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-5 flex gap-3 text-sm text-white/50" style={{ borderTop: '1px solid rgba(201,169,110,0.14)' }}>
                  <Icon name="X" size={17} className="text-white/30 shrink-0 mt-0.5" />
                  <p><span className="text-white/70">Не подходит,</span> если продажи пока строятся с нуля и нет команды, которую можно диагностировать.</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="md:col-span-2">
              <div className="p-7 rounded-sm h-full flex flex-col" style={{ background: 'rgba(201,169,110,0.07)', border: '1px solid rgba(201,169,110,0.3)' }}>
                <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Формат</p>
                <p className="font-cormorant text-3xl text-off-white mb-1">1 день · 5 часов</p>
                <p className="text-white/60 text-sm mb-4">5+ менеджеров</p>
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  РОП / коммерческий директор — обязательно присутствует хотя бы на части работы и получает итоговый разбор.
                </p>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  <span className="text-off-white">Где:</span> на территории вашей компании или на выбранной площадке в Санкт-Петербурге.
                </p>
                <div className="mt-auto">
                  <p className="text-xs tracking-widest uppercase text-white/40 mb-1">Стоимость участия в тесте</p>
                  <p className="font-cormorant text-4xl gold-text font-semibold mb-1">9 000 ₽</p>
                  <p className="text-gold/80 text-sm mb-5">Только 5 компаний.</p>
                  <button onClick={openModal} className="btn-gold w-full px-6 py-4 text-sm tracking-wider uppercase rounded-sm">
                    Подать заявку на тест
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ПОЧЕМУ Я ЭТО ДЕЛАЮ */}
      <section className="py-24 px-6 md:px-16 lg:px-24" style={ALT_BG}>
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <SectionTitle eyebrow="Почему я это делаю">
              Что происходит с продажей, когда начинается настоящий разговор
            </SectionTitle>
            <p className="text-white/65 text-[15px] md:text-lg leading-relaxed mb-4">
              Я 15 лет работаю на стыке B2B, маркетинга, продукта и коммерции. Выводил продукты на федеральный рынок, создавал новые категории, работал с брендом Федерации бокса России, Гусь-Хрустальным стекольным заводом, производственными и коммерческими компаниями.
            </p>
            <p className="text-white/65 text-[15px] md:text-lg leading-relaxed mb-6">
              В этой технологии я соединяю то, что обычно существует отдельно:
            </p>
            <p className="font-cormorant text-xl md:text-2xl gold-text mb-6">
              продукт → алгоритм продаж → переговоры → поведение менеджера → результат сделки
            </p>
            <p className="text-white/50 text-[15px] leading-relaxed">
              Я не хочу ещё раз рассказывать рынку, что «продажи — это важно». Я хочу показать, что происходит с продажей в тот момент, когда начинается настоящий разговор.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ОБО МНЕ */}
      <section id="about" className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div className="relative">
                <div className="aspect-[3/4] max-w-sm rounded-sm overflow-hidden relative"
                  style={{ border: '1px solid rgba(201,169,110,0.2)' }}>
                  {aboutPhotos.map((src, i) => (
                    <img key={i} src={src} alt="Андрей Дорошенко"
                      className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000"
                      style={{ opacity: photoIdx === i ? 1 : 0 }} />
                  ))}
                </div>
                <div className="flex gap-2 mt-5">
                  {aboutPhotos.map((_, i) => (
                    <button key={i} onClick={() => setPhotoIdx(i)}
                      className="h-px transition-all duration-300"
                      style={{ width: 24, background: photoIdx === i ? '#C9A96E' : 'rgba(201,169,110,0.25)' }} />
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Об авторе</p>
              <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light mb-6">
                Андрей Дорошенко
              </h2>
              <div className="flex flex-wrap gap-2 mb-8">
                {ABOUT_TAGS.map((t, i) => (
                  <span key={i} className="text-xs tracking-wide px-3 py-1.5 rounded-sm text-white/60"
                    style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)' }}>
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-white/70 text-lg leading-relaxed mb-4">
                15 лет практики в реальном B2B.
              </p>
              <p className="text-white/50 text-[15px] leading-relaxed mb-4">
                Автор бизнес-симуляции «Город продаж».
              </p>
              <p className="text-white/50 text-[15px] leading-relaxed mb-4">
                Создавал маркетинговые и коммерческие стратегии для производственных компаний.
              </p>
              <p className="text-white/50 text-[15px] leading-relaxed mb-4">
                Выводил на федеральный рынок бренд «Чебупели» и участвовал в создании новой продуктовой категории.
              </p>
              <p className="text-white/50 text-[15px] leading-relaxed mb-4">
                Работал с брендом Федерации бокса России.
              </p>
              <p className="text-white/50 text-[15px] leading-relaxed mb-4">
                Работал с Гусь-Хрустальным стекольным заводом.
              </p>
              <p className="text-white/50 text-[15px] leading-relaxed mb-6">
                Практика антикризисного управления и фасилитации стратегических команд.
              </p>
              <div className="p-5 rounded-sm" style={CARD_STYLE}>
                <p className="flex items-center gap-2 text-xs tracking-widest uppercase gold-text mb-3">
                  <Icon name="GraduationCap" size={15} />
                  Образование
                </p>
                <ul className="flex flex-col gap-2 text-white/65 text-sm leading-relaxed mb-5">
                  <li className="flex gap-2"><Icon name="ChevronRight" size={15} className="text-gold shrink-0 mt-0.5" />Экономическое высшее образование</li>
                  <li className="flex gap-2"><Icon name="ChevronRight" size={15} className="text-gold shrink-0 mt-0.5" />Диплом о профессиональной переподготовке: арбитражный и антикризисный управляющий (2025)</li>
                  <li className="flex gap-2"><Icon name="ChevronRight" size={15} className="text-gold shrink-0 mt-0.5" />Сертификат по фасилитации, школа НЛП Плигина и Герасимова, программа NLP-MBA (2013)</li>
                </ul>
                <div className="grid grid-cols-2 gap-3">
                  {DIPLOMAS.map((d, i) => (
                    <button key={i} type="button" onClick={() => setLightbox(d.src)}
                      className="group text-left rounded-sm overflow-hidden"
                      style={{ border: '1px solid rgba(201,169,110,0.25)' }}>
                      <img src={d.src} alt={d.caption} className="w-full h-28 object-cover object-top group-hover:opacity-80 transition-opacity" />
                      <span className="block px-2 py-1.5 text-[11px] text-white/50">{d.caption}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ПОСЛЕ ПИЛОТА */}
      <section className="py-24 px-6 md:px-16 lg:px-24" style={ALT_BG}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <SectionTitle eyebrow="После пилота">
              Полигон не заканчивается одним днём
            </SectionTitle>
            <p className="text-white/60 text-[15px] md:text-lg leading-relaxed text-center max-w-2xl mx-auto mb-12">
              Если после диагностики становится понятно, что отделу нужна системная работа, возможны следующие форматы:
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-4">
            {AFTER_PILOT.map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="p-7 rounded-sm h-full" style={CARD_STYLE}>
                  <Icon name={s.icon} size={26} className="text-gold mb-4" />
                  <p className="font-cormorant text-xl gold-text uppercase tracking-wider mb-2">{s.title}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="text-center font-cormorant text-2xl text-off-white mt-10">
            Сначала смотрим. Потом решаем, что менять.
          </p>
        </div>
      </section>

      {/* БЕЗ ОБЕЩАНИЙ */}
      <section className="py-24 px-6 md:px-16 lg:px-24" style={LINE_TOP}>
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <SectionTitle eyebrow="5 компаний. 1 месяц. Одна технология">
              Я не обещаю вам «+40% к выручке»
            </SectionTitle>
            <p className="text-white/65 text-[15px] md:text-lg leading-relaxed mb-4">
              И не обещаю, что после пяти часов все менеджеры станут суперпродавцами. Я обещаю другое: мы посмотрим, что происходит с вашей системой продаж в живом переговорном контакте.
            </p>
            <div className="flex flex-col gap-2 text-white/55 text-[15px] leading-relaxed">
              <p>Если проблема в менеджерах — это станет видно.</p>
              <p>Если проблема в алгоритме — тоже.</p>
              <p>Если проблема в самом предложении — её тоже не получится спрятать за красивым скриптом.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* КОНТАКТЫ */}
      <section id="contact" className="py-24 px-6 md:px-16 lg:px-24" style={ALT_BG}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
                Хотите участвовать в рыночном тесте?
              </h2>
              <div className="section-divider mt-6" />
              <p className="text-white/50 text-[15px] leading-relaxed mt-6">
                Расскажите о компании и отделе продаж. Я посмотрю, подходит ли ваша команда под формат.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mb-14">
            <ContactForm />
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-center text-white/60 text-sm mb-6">
              Андрей Дорошенко · Санкт-Петербург · 5 компаний в октябре
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              <a href="tel:89206200034" className="flex items-center gap-2 gold-text hover:opacity-70 transition-opacity">
                <Icon name="Phone" size={15} className="text-gold/60" />
                <span className="font-cormorant text-xl">+7 (920) 620-00-34</span>
              </a>
              <a href="mailto:and-doroshe@mail.ru" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                <Icon name="Mail" size={15} className="text-white/30" />
                <span className="text-sm">and-doroshe@mail.ru</span>
              </a>
              <a href="https://t.me/adprodmarketing" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/50 hover:text-gold transition-colors">
                <Icon name="Send" size={15} className="text-white/30" />
                <span className="text-sm">@adprodmarketing</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: '#060606' }} className="py-8 px-6 md:px-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="font-cormorant text-lg gold-text">Андрей Дорошенко</p>
            <p className="text-white/25 text-xs mt-1">Моя технология × ваш отдел продаж</p>
          </div>
          <div className="flex gap-4">
            <a href="https://t.me/adprodmarketing" target="_blank" rel="noopener noreferrer"
              className="text-white/25 hover:text-gold transition-colors">
              <Icon name="Send" size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}