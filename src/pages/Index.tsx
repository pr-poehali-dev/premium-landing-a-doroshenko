import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

const CASES = [
  {
    company: 'Территория Обжарки',
    city: 'Владимир',
    budget: '300 000 ₽/мес',
    lead: '1 400 ₽',
    order: '12 500 ₽',
    tag: 'Производство кофе',
    initial: 'ТО',
    logo: 'https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/ef0e2b04-8b16-4d46-b901-82096ef59a94.png',
    url: 'https://to.coffee/',
  },
  {
    company: 'Промсиз',
    city: 'Гусь-Хрустальный',
    budget: '110 000 ₽/мес',
    lead: '2 100 ₽',
    order: '14 000 ₽',
    tag: 'Промышленное производство',
    initial: 'ПС',
    logo: 'https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/281440e6-d5e7-4017-9759-e2097988d548.jpg',
    url: 'https://ghsz.ru/',
  },
  {
    company: 'Литмаш М',
    city: 'Ивановская обл.',
    budget: '500 000 ₽/мес',
    lead: '8 000 ₽',
    order: '25 000 ₽',
    tag: 'Машиностроение',
    initial: 'ЛМ',
    logo: null,
    url: 'https://litmashm.ru/',
  },
];

const WHO_ITEMS = [
  'Производство работает более 5 лет',
  'Продажи перестали расти прежними темпами',
  'Маркетплейсы не дают ожидаемой прибыли',
  'Отдел продаж жалуется на отсутствие новых клиентов',
  'Есть продукт и мощности, но не хватает входящего спроса',
  'Руководитель устал от подрядчиков, которые показывают клики вместо результата',
];

const PROBLEM_QUESTIONS = [
  'Почему клиент должен выбрать именно вас?',
  'Чем вы отличаетесь от десятков конкурентов?',
  'Какой сегмент рынка для вас наиболее выгоден?',
  'Что на самом деле покупает клиент кроме продукта?',
];

const STEPS = [
  { num: '01', title: 'Анализ рынка и конкурентов' },
  { num: '02', title: 'Поиск сильных сторон продукта' },
  { num: '03', title: 'Формирование оффера' },
  { num: '04', title: 'Подготовка посадочной страницы' },
  { num: '05', title: 'Запуск Яндекс.Директ' },
  { num: '06', title: 'Анализ качества лидов совместно с отделом продаж' },
];

const OFFER_ITEMS = [
  { icon: 'Search', title: 'Анализ рынка', text: 'Понимание конкурентной среды и спроса.' },
  { icon: 'Lightbulb', title: 'Анализ оффера', text: 'Проверка того, что именно продается клиенту.' },
  { icon: 'Target', title: 'Настройка Яндекс.Директ', text: 'Поиск целевой аудитории через поиск и РСЯ.' },
  { icon: 'BarChart2', title: 'Контроль рекламной кампании', text: 'Первые 30 дней сопровождения.' },
  { icon: 'MessageCircle', title: 'Совместная работа с отделом продаж', text: 'Анализ качества обращений и обратной связи.' },
];

const ABOUT_INDUSTRIES = [
  'пищевыми производствами',
  'промышленными компаниями',
  'машиностроением',
  'металлообработкой',
  'B2B-поставщиками',
];

function useInView(threshold = 0.15) {
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

function Modal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', phone: '', city: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('https://functions.poehali.dev/fc323d06-bbf9-4e34-b478-9a1d63552d0d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'audit' }),
      });
      if (res.ok) setSent(true);
    } catch {
      setSent(true);
    }
    setLoading(false);
  };

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md" style={{ background: '#111', border: '1px solid rgba(201,169,110,0.35)', borderRadius: 4 }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
          <Icon name="X" size={20} />
        </button>
        {sent ? (
          <div className="p-10 text-center">
            <div className="text-5xl mb-4">✓</div>
            <p className="font-cormorant text-2xl gold-text mb-2">Заявка отправлена</p>
            <p className="text-white/60 font-golos text-sm">Андрей свяжется с вами в ближайшее время</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-4">
            <h3 className="font-cormorant text-2xl text-off-white mb-1">Получить оценку проекта</h3>
            <p className="text-white/50 text-sm font-golos mb-2">Заполните форму — Андрей свяжется с вами лично</p>
            <input
              className="input-dark rounded px-4 py-3 text-sm w-full"
              placeholder="ФИО *"
              required
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            />
            <input
              className="input-dark rounded px-4 py-3 text-sm w-full"
              placeholder="Телефон *"
              required
              type="tel"
              value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
            />
            <input
              className="input-dark rounded px-4 py-3 text-sm w-full"
              placeholder="Город"
              value={form.city}
              onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
            />
            <textarea
              className="input-dark rounded px-4 py-3 text-sm w-full resize-none"
              placeholder="Расскажите подробнее о вашем бизнесе"
              rows={3}
              value={form.message}
              onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
            />
            <button type="submit" disabled={loading} className="btn-gold rounded py-3 text-sm mt-2 disabled:opacity-60">
              {loading ? 'Отправляем...' : 'Отправить заявку'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Index() {
  const [modalOpen, setModalOpen] = useState(false);

  const hero = useInView(0.1);
  const who = useInView(0.1);
  const problem = useInView(0.1);
  const approach = useInView(0.1);
  const cases = useInView(0.1);
  const offer = useInView(0.1);
  const price = useInView(0.1);
  const about = useInView(0.1);
  const bottom = useInView(0.1);

  return (
    <div className="min-h-screen bg-obsidian text-off-white font-golos overflow-x-hidden">
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-5"
        style={{ background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
        <div className="flex items-center gap-3">
          <img
            src="https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/ffd046c4-b35f-40c2-9b83-50f0dd9100ba.png"
            alt="Андрей Дорошенко"
            className="w-8 h-8 rounded-full object-cover object-top"
            style={{ border: '1px solid rgba(201,169,110,0.4)' }}
          />
          <div className="font-cormorant text-lg tracking-widest uppercase gold-text">А. Дорошенко</div>
        </div>
        <nav className="hidden md:flex gap-8 text-sm text-white/50 tracking-wide">
          <a href="#cases" className="hover:text-white transition-colors">Кейсы</a>
          <a href="#about" className="hover:text-white transition-colors">Обо мне</a>
          <a href="#offer" className="hover:text-white transition-colors">Услуги</a>
          <a href="#contact" className="hover:text-white transition-colors">Контакт</a>
        </nav>
        <a href="tel:89206200034" className="text-sm gold-text hover:opacity-80 transition-opacity font-medium">
          8 920 620-00-34
        </a>
      </header>

      {/* БЛОК 1 — HERO */}
      <section ref={hero.ref} className="relative min-h-screen flex flex-col justify-center noise-bg pt-24 pb-20 px-6 md:px-16 lg:px-24">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(201,169,110,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-5xl">
          <p className={`text-xs tracking-[0.3em] uppercase text-gold mb-8 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            style={{ transitionDelay: '0.1s' }}>
            Яндекс.Директ для производственных компаний
          </p>

          <h1 className={`font-cormorant font-light leading-[1.1] mb-8 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ fontSize: 'clamp(2.4rem, 5.5vw, 5rem)', transitionDelay: '0.2s' }}>
            Новые клиенты для<br />
            производственных компаний<br />
            <span className="gold-gradient">через Яндекс.Директ</span>
          </h1>

          <div className={`mb-10 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            style={{ transitionDelay: '0.35s' }}>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl font-light">
              Помогаю производствам привлекать клиентов напрямую, снижать зависимость от маркетплейсов, тендеров и одного крупного заказчика.
            </p>
            <p className="text-white/50 text-[15px] mt-4 max-w-2xl leading-relaxed">
              От анализа рынка и оффера до запуска рекламной кампании и контроля качества лидов.
            </p>
            <p className="text-white/35 text-sm mt-4">
              Работаю с бюджетами от 75 000 ₽/мес
            </p>
          </div>

          <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 ${hero.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            style={{ transitionDelay: '0.5s' }}>
            <button onClick={() => setModalOpen(true)} className="btn-gold px-10 py-4 text-sm tracking-wider uppercase rounded">
              Получить оценку проекта
            </button>
            <a href="#cases" className="flex items-center gap-2 px-8 py-4 text-sm tracking-wide text-white/60 hover:text-white transition-colors border border-white/10 rounded hover:border-white/25">
              Смотреть кейсы
              <Icon name="ArrowDown" size={16} />
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 text-xs tracking-widest">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-gold/40" />
        </div>
      </section>

      {/* БЛОК 2 — КОМУ ПОДХОДИТ */}
      <section ref={who.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ background: 'linear-gradient(180deg, #0A0A0A 0%, #111 50%, #0A0A0A 100%)', borderTop: '1px solid rgba(201,169,110,0.1)' }}>
        <div className="max-w-4xl mx-auto">
          <div className={`mb-14 transition-all duration-700 ${who.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Целевая аудитория</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Обычно ко мне обращаются, когда
            </h2>
            <div className="section-divider mt-6" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {WHO_ITEMS.map((item, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 p-6 rounded-sm transition-all duration-700 ${who.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.12)', transitionDelay: `${0.1 + i * 0.08}s` }}
              >
                <div className="shrink-0 mt-0.5">
                  <Icon name="Check" size={16} className="text-gold" />
                </div>
                <p className="text-white/75 text-[15px] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* БЛОК 3 — ПРОБЛЕМА */}
      <section ref={problem.ref} className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <div className={`mb-14 transition-all duration-700 ${problem.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Причина неудач</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Почему реклама часто не работает
            </h2>
            <div className="section-divider mt-6" />
          </div>

          <div className={`transition-all duration-700 ${problem.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '0.15s' }}>
            <p className="text-white/65 text-lg leading-relaxed mb-10 max-w-2xl">
              Большинство производств запускают рекламу слишком рано.<br />
              До запуска важно ответить на вопросы:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {PROBLEM_QUESTIONS.map((q, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-sm transition-all duration-700 ${problem.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.15)', transitionDelay: `${0.2 + i * 0.1}s` }}
                >
                  <p className="text-off-white/80 text-[15px] leading-relaxed font-light italic">«{q}»</p>
                </div>
              ))}
            </div>

            <div className={`p-7 rounded-sm transition-all duration-700 ${problem.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ background: 'rgba(201,169,110,0.07)', border: '1px solid rgba(201,169,110,0.25)', transitionDelay: '0.6s' }}>
              <p className="text-white/80 text-[15px] leading-relaxed">
                Если на эти вопросы нет ответа, реклама лишь быстрее сожжет бюджет.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* БЛОК 4 — МОЙ ПОДХОД */}
      <section ref={approach.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ background: 'linear-gradient(180deg, #0A0A0A 0%, #0f0f0f 100%)', borderTop: '1px solid rgba(201,169,110,0.1)' }}>
        <div className="max-w-4xl mx-auto">
          <div className={`mb-14 transition-all duration-700 ${approach.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Методология</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Сначала рынок и оффер —<br />
              <span className="gold-gradient">потом реклама</span>
            </h2>
            <div className="section-divider mt-6" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className={`flex items-start gap-5 p-6 rounded-sm transition-all duration-700 ${approach.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ background: 'rgba(201,169,110,0.03)', border: '1px solid rgba(201,169,110,0.1)', transitionDelay: `${0.1 + i * 0.1}s` }}
              >
                <div className="shrink-0 font-cormorant text-3xl gold-text font-light leading-none opacity-50">{step.num}</div>
                <p className="text-off-white/80 text-[15px] leading-relaxed pt-1">{step.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* БЛОК 5 — КЕЙСЫ */}
      <section id="cases" ref={cases.ref} className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${cases.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Реальные результаты</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Кейсы производственных компаний
            </h2>
            <div className="section-divider mt-6" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {CASES.map((c, i) => (
              <div
                key={i}
                className={`card-case rounded-sm p-8 transition-all duration-700 ${cases.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${0.1 + i * 0.15}s` }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="shrink-0 block group">
                    <div className="w-16 h-16 rounded-sm overflow-hidden flex items-center justify-center"
                      style={{ background: c.logo ? '#fff' : 'linear-gradient(135deg, rgba(201,169,110,0.15), rgba(201,169,110,0.05))', border: '1px solid rgba(201,169,110,0.25)' }}>
                      {c.logo ? (
                        <img src={c.logo} alt={c.company} className="w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <span className="font-cormorant text-xl font-bold" style={{ color: '#C9A96E' }}>{c.initial}</span>
                      )}
                    </div>
                  </a>
                  <div>
                    <a href={c.url} target="_blank" rel="noopener noreferrer"
                      className="font-medium text-off-white text-sm hover:text-gold transition-colors flex items-center gap-1 group">
                      {c.company}
                      <Icon name="ArrowUpRight" size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-gold" />
                    </a>
                    <p className="text-white/40 text-xs mt-0.5">{c.city}</p>
                  </div>
                </div>

                <div className="text-xs tracking-wider uppercase text-gold/60 mb-6 pb-4"
                  style={{ borderBottom: '1px solid rgba(201,169,110,0.12)' }}>
                  {c.tag}
                </div>

                <div className="space-y-5">
                  <div>
                    <p className="text-white/35 text-xs tracking-wide mb-1">Рекламный бюджет</p>
                    <p className="font-cormorant text-2xl text-off-white">{c.budget}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/35 text-xs tracking-wide mb-1">Стоимость обращения</p>
                      <p className="font-cormorant text-xl gold-text font-semibold">{c.lead}</p>
                    </div>
                    <div>
                      <p className="text-white/35 text-xs tracking-wide mb-1">Стоимость заказа</p>
                      <p className="font-cormorant text-xl text-off-white">{c.order}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* БЛОК 6 — ЧТО ВХОДИТ */}
      <section id="offer" ref={offer.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ background: 'linear-gradient(180deg, #0A0A0A 0%, #111 50%, #0A0A0A 100%)', borderTop: '1px solid rgba(201,169,110,0.1)' }}>
        <div className="max-w-5xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${offer.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Состав работ</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Запуск рекламной системы
            </h2>
            <div className="section-divider mt-6" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {OFFER_ITEMS.map((item, i) => (
              <div
                key={i}
                className={`card-case rounded-sm p-7 transition-all duration-700 ${offer.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${0.1 + i * 0.1}s` }}
              >
                <div className="w-10 h-10 rounded flex items-center justify-center mb-5"
                  style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.25)' }}>
                  <Icon name={item.icon} fallback="Star" size={18} className="text-gold" />
                </div>
                <p className="text-off-white font-medium text-sm mb-2">{item.title}</p>
                <p className="text-white/50 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          <div className={`mt-12 text-center transition-all duration-700 ${offer.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '0.6s' }}>
            <button onClick={() => setModalOpen(true)} className="btn-gold px-12 py-4 text-sm tracking-wider uppercase rounded">
              Получить оценку проекта
            </button>
          </div>
        </div>
      </section>

      {/* БЛОК 7 — СТОИМОСТЬ */}
      <section ref={price.ref} className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <div className={`text-center mb-14 transition-all duration-700 ${price.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Инвестиции</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Стоимость запуска
            </h2>
            <div className="section-divider mt-6" />
          </div>

          <div className={`rounded-sm p-10 transition-all duration-700 ${price.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.2)', transitionDelay: '0.15s' }}>
            <div className="space-y-8">
              <div className="flex items-center justify-between pb-6" style={{ borderBottom: '1px solid rgba(201,169,110,0.12)' }}>
                <p className="text-white/60 text-[15px]">Настройка рекламной кампании</p>
                <p className="font-cormorant text-3xl gold-text font-semibold">50 000 ₽</p>
              </div>
              <div className="flex items-center justify-between pb-6" style={{ borderBottom: '1px solid rgba(201,169,110,0.12)' }}>
                <p className="text-white/60 text-[15px]">Минимальный рекламный бюджет</p>
                <p className="font-cormorant text-3xl text-off-white">75 000 ₽/мес</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-white/60 text-[15px]">Первые обращения</p>
                <p className="font-cormorant text-2xl text-off-white">от 2 недель после запуска</p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <button onClick={() => setModalOpen(true)} className="btn-gold px-12 py-4 text-sm tracking-wider uppercase rounded">
                Получить оценку проекта
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* БЛОК 8 — ОБО МНЕ */}
      <section id="about" ref={about.ref} className="py-24 px-6 md:px-16 lg:px-24"
        style={{ background: 'linear-gradient(180deg, #0A0A0A 0%, #111 50%, #0A0A0A 100%)', borderTop: '1px solid rgba(201,169,110,0.1)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Photo side */}
            <div className={`transition-all duration-700 ${about.inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
              style={{ transitionDelay: '0.1s' }}>
              <div className="relative">
                <div className="aspect-[3/4] max-w-sm rounded-sm overflow-hidden"
                  style={{ border: '1px solid rgba(201,169,110,0.25)' }}>
                  <img
                    src="https://cdn.poehali.dev/projects/bb03cd52-a7e1-49a3-8dc8-9ec2c7948b7a/bucket/42dc42eb-1445-4a0e-9a00-0a3400fe8b64.png"
                    alt="Андрей Дорошенко"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-sm"
                  style={{ border: '1px solid rgba(201,169,110,0.2)', zIndex: -1 }} />
                <div className="absolute -top-4 -left-4 w-16 h-16 rounded-sm"
                  style={{ border: '1px solid rgba(201,169,110,0.1)', zIndex: -1 }} />
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <a href="https://t.me/adprodmarketing" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-white/50 hover:text-gold transition-colors group">
                  <div className="w-8 h-8 rounded flex items-center justify-center"
                    style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)' }}>
                    <Icon name="Send" size={14} className="text-gold" />
                  </div>
                  <span>Telegram-канал</span>
                  <Icon name="ArrowUpRight" size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a href="https://max.ru/u/f9LHodD0cOJeh1VeDiOnEVtgDFXOG1s8s87I-zodKmshv0Z-Mo9AAb_D5b0" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-white/50 hover:text-gold transition-colors group">
                  <div className="w-8 h-8 rounded flex items-center justify-center"
                    style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)' }}>
                    <Icon name="MessageSquare" size={14} className="text-gold" />
                  </div>
                  <span>ВКонтакте / MAX</span>
                  <Icon name="ArrowUpRight" size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>

            {/* Text side */}
            <div className={`transition-all duration-700 ${about.inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
              style={{ transitionDelay: '0.2s' }}>
              <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Обо мне</p>
              <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
                Андрей<br />Дорошенко
              </h2>
              <div className="w-12 h-px bg-gold mb-8 mt-6" />

              <div className="space-y-5 text-white/65 leading-relaxed text-[15px]">
                <p>
                  Более 7 лет занимаюсь привлечением клиентов для производственных компаний через Яндекс.Директ.
                </p>
                <div>
                  <p className="mb-3">Работал с:</p>
                  <ul className="space-y-2 ml-1">
                    {ABOUT_INDUSTRIES.map((industry, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-1 h-1 rounded-full bg-gold shrink-0" />
                        <span>{industry}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p>
                  Моя задача — не просто запустить рекламу, а помочь компании сформировать предложение, которое рынок готов покупать.
                </p>
              </div>

              <button onClick={() => setModalOpen(true)}
                className="mt-10 flex items-center gap-3 text-sm tracking-wider uppercase gold-text hover:opacity-70 transition-opacity">
                <span>Получить оценку проекта</span>
                <Icon name="ArrowRight" size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* БЛОК 9 — ФОРМА */}
      <section id="contact" ref={bottom.ref} className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-2xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-700 ${bottom.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-xs tracking-[0.3em] uppercase gold-text mb-4">Бесплатно</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-off-white font-light">
              Узнайте, подойдет ли Яндекс.Директ вашему производству
            </h2>
            <p className="text-white/45 mt-5 text-[15px] leading-relaxed">
              Оставьте контакты. Проведу предварительную оценку:
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {['рынка', 'конкурентов', 'рекламного потенциала', 'примерной стоимости обращения'].map((item, i) => (
                <span key={i} className="text-xs px-3 py-1.5 rounded-sm gold-text"
                  style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)' }}>
                  {item}
                </span>
              ))}
            </div>
            <div className="section-divider mt-6" />
          </div>

          <BottomForm onSuccess={() => {}} />
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(201,169,110,0.12)', background: '#080808' }} className="py-10 px-6 md:px-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="font-cormorant text-xl gold-text mb-1">Дорошенко Андрей Анатольевич</p>
            <p className="text-white/35 text-xs">Яндекс.Директ для производственных компаний</p>
            <p className="text-white/25 text-xs mt-1">Москва, Курская, территория завода Арма</p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-right">
            <a href="tel:89206200034" className="gold-text hover:opacity-70 transition-opacity">8 920 620-00-34</a>
            <a href="mailto:and-doroshe@mail.ru" className="text-white/40 hover:text-white transition-colors">and-doroshe@mail.ru</a>
            <div className="flex gap-4 mt-2 justify-end">
              <a href="https://t.me/adprodmarketing" target="_blank" rel="noopener noreferrer"
                className="text-white/30 hover:text-gold transition-colors">
                <Icon name="Send" size={16} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BottomForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({ name: '', phone: '', city: '', company: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('https://functions.poehali.dev/fc323d06-bbf9-4e34-b478-9a1d63552d0d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'bottom' }),
      });
      if (res.ok) { setSent(true); onSuccess(); }
    } catch {
      setSent(true);
      onSuccess();
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">✓</div>
        <p className="font-cormorant text-2xl gold-text mb-2">Заявка отправлена</p>
        <p className="text-white/60 text-sm">Андрей свяжется с вами в ближайшее время</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        className="input-dark rounded px-4 py-3 text-sm w-full"
        placeholder="ФИО *"
        required
        value={form.name}
        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
      />
      <input
        className="input-dark rounded px-4 py-3 text-sm w-full"
        placeholder="Телефон *"
        required
        type="tel"
        value={form.phone}
        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
      />
      <input
        className="input-dark rounded px-4 py-3 text-sm w-full"
        placeholder="Город"
        value={form.city}
        onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
      />
      <input
        className="input-dark rounded px-4 py-3 text-sm w-full"
        placeholder="Компания"
        value={form.company}
        onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
      />
      <textarea
        className="input-dark rounded px-4 py-3 text-sm w-full resize-none"
        placeholder="Расскажите о вашем производстве"
        rows={3}
        value={form.message}
        onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
      />
      <button type="submit" disabled={loading} className="btn-gold rounded py-4 text-sm tracking-wider uppercase mt-2 disabled:opacity-60">
        {loading ? 'Отправляем...' : 'Получить оценку проекта'}
      </button>
    </form>
  );
}
