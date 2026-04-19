import { Link } from "react-router-dom";

export default function HomeFinancePage() {
  const features = [
    {
      title: "Quản lý thu chi",
      desc: "Ghi lại mọi khoản thu và chi hằng ngày, giúp bạn nắm rõ dòng tiền cá nhân hoặc gia đình.",
      icon: "💸",
    },
    {
      title: "Báo cáo trực quan",
      desc: "Theo dõi tình hình tài chính qua biểu đồ theo tuần, tháng hoặc khoảng thời gian tùy chọn.",
      icon: "📊",
    },
    {
      title: "Lập ngân sách",
      desc: "Đặt giới hạn chi tiêu cho từng danh mục để kiểm soát tài chính hiệu quả hơn.",
      icon: "🎯",
    },
    {
      title: "Phân loại thông minh",
      desc: "Tách riêng các khoản chi như ăn uống, đi lại, mua sắm, hóa đơn để dễ phân tích.",
      icon: "🗂️",
    },
  ];

  const stats = [
    { label: "Người dùng quản lý chi tiêu", value: "10.000+" },
    { label: "Giao dịch được theo dõi", value: "250.000+" },
    { label: "Danh mục tài chính", value: "30+" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-emerald-600">
              Finance Manager
            </h1>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#gioi-thieu"
              className="text-sm font-medium hover:text-emerald-600"
            >
              Giới thiệu
            </a>
            <a
              href="#tinh-nang"
              className="text-sm font-medium hover:text-emerald-600"
            >
              Tính năng
            </a>
            <a
              href="#thong-ke"
              className="text-sm font-medium hover:text-emerald-600"
            >
              Thống kê
            </a>
            <a
              href="#lien-he"
              className="text-sm font-medium hover:text-emerald-600"
            >
              Liên hệ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-100"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </header>

      <section id="gioi-thieu" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-white to-cyan-100" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <span className="inline-flex rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700">
              Web quản lý tài chính cá nhân hiện đại
            </span>
            <h2 className="mt-6 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
              Kiểm soát tiền bạc dễ dàng, xây dựng thói quen chi tiêu thông minh
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Finance Manager là nền tảng hỗ trợ người dùng theo dõi thu nhập,
              chi tiêu, ngân sách và các báo cáo tài chính một cách trực quan.
              Chỉ với vài thao tác, bạn có thể biết mình đã chi bao nhiêu, còn
              lại bao nhiêu và cần tối ưu ở đâu.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="rounded-2xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-emerald-700"
              >
                Bắt đầu ngay
              </Link>
              <Link
                to="/login"
                className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold hover:bg-slate-100"
              >
                Đăng nhập tài khoản
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
                >
                  <p className="text-2xl font-extrabold text-slate-900">
                    {item.value}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Tổng quan tháng này</p>
                  <h3 className="text-2xl font-bold text-slate-900">
                    12.500.000đ
                  </h3>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                  +18%
                </span>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>Ngân sách đã dùng</span>
                    <span className="font-semibold">68%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-200">
                    <div className="h-3 w-[68%] rounded-full bg-emerald-500" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-sm text-slate-500">Thu nhập</p>
                    <p className="mt-2 text-xl font-bold text-emerald-700">
                      18.000.000đ
                    </p>
                  </div>
                  <div className="rounded-2xl bg-rose-50 p-4">
                    <p className="text-sm text-slate-500">Chi tiêu</p>
                    <p className="mt-2 text-xl font-bold text-rose-600">
                      5.500.000đ
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="mb-4 text-sm font-semibold text-slate-700">
                    Danh mục chi tiêu nổi bật
                  </p>
                  <div className="space-y-3">
                    {[
                      ["Ăn uống", "2.000.000đ"],
                      ["Di chuyển", "1.200.000đ"],
                      ["Mua sắm", "1.500.000đ"],
                    ].map(([name, amount]) => (
                      <div
                        key={name}
                        className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm"
                      >
                        <span className="text-sm font-medium">{name}</span>
                        <span className="text-sm font-bold text-slate-900">
                          {amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tinh-nang" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Tính năng nổi bật
          </p>
          <h3 className="mt-4 text-3xl font-extrabold text-slate-900 md:text-4xl">
            Mọi thứ bạn cần để quản lý tài chính trong một nơi
          </h3>
          <p className="mt-4 text-lg text-slate-600">
            Giao diện thân thiện, báo cáo dễ hiểu và công cụ lập kế hoạch tài
            chính phù hợp cho sinh viên, nhân viên văn phòng và gia đình.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 text-4xl">{feature.icon}</div>
              <h4 className="text-xl font-bold text-slate-900">
                {feature.title}
              </h4>
              <p className="mt-3 leading-7 text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="thong-ke" className="bg-slate-900 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Vì sao nên chọn chúng tôi
            </p>
            <h3 className="mt-4 text-3xl font-extrabold md:text-4xl">
              Theo dõi tài chính rõ ràng, đưa ra quyết định tốt hơn mỗi ngày
            </h3>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Không chỉ là nơi lưu lại giao dịch, hệ thống còn giúp bạn nhìn
              thấy thói quen chi tiêu, đánh giá mức độ sử dụng ngân sách và hỗ
              trợ xây dựng kế hoạch tiết kiệm lâu dài.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              [
                "Bảo mật dữ liệu",
                "Dữ liệu tài chính được lưu trữ an toàn và dễ quản lý.",
              ],
              [
                "Giao diện dễ dùng",
                "Thiết kế trực quan, thao tác nhanh trên cả máy tính và điện thoại.",
              ],
              [
                "Báo cáo theo thời gian",
                "Xem biến động tài chính theo ngày, tuần, tháng hoặc tùy chọn.",
              ],
              [
                "Hỗ trợ lập kế hoạch",
                "Đặt mục tiêu tiết kiệm và kiểm soát chi tiêu hiệu quả hơn.",
              ],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <h4 className="text-lg font-bold">{title}</h4>
                <p className="mt-3 text-sm leading-7 text-slate-300">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="lien-he" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-[32px] bg-gradient-to-r from-emerald-600 to-cyan-600 px-8 py-12 text-white shadow-2xl md:px-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h3 className="text-3xl font-extrabold md:text-4xl">
                Bắt đầu quản lý tài chính của bạn ngay hôm nay
              </h3>
              <p className="mt-4 text-lg text-emerald-50">
                Tạo thói quen theo dõi thu chi, tối ưu ngân sách và tiến gần hơn
                đến mục tiêu tài chính cá nhân.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="rounded-2xl bg-white px-6 py-3 font-bold text-emerald-700 hover:bg-slate-100"
              >
                Đăng ký miễn phí
              </Link>
              <Link
                to="/login"
                className="rounded-2xl border border-white/40 px-6 py-3 font-bold text-white hover:bg-white/10"
              >
                Đăng nhập ngay
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© 2026 Finance Manager. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-emerald-600">
              Chính sách
            </a>
            <a href="#" className="hover:text-emerald-600">
              Điều khoản
            </a>
            <a href="#" className="hover:text-emerald-600">
              Hỗ trợ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
