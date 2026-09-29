import { Link } from "react-router-dom";
import { PageHeader, primaryClass } from "../../../shared/ui/Elements";

export default function AboutPage() {
  return (
    <div className="w-full px-4 py-12 sm:px-8 lg:px-12 lg:py-16 2xl:px-20">
      <PageHeader
        eyebrow="About Okoa Food"
        title="A bridge between plenty and need"
        description="Okoa Food helps people list surplus food and essentials and helps approved shelters and NGOs discover what is available nearby."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <section className="bg-pink-50 p-8 dark:bg-pink-900 lg:p-12">
          <h2 className="text-xl font-bold">For donors</h2>
          <p className="mt-3 leading-relaxed text-stone-600 dark:text-stone-300">
            Create an account, describe your donation, and share its pickup
            area. Your listing becomes visible to the community.
          </p>
        </section>
        <section className="bg-amber-50 p-8 dark:bg-stone-900 lg:p-12">
          <h2 className="text-xl font-bold">For organizations</h2>
          <p className="mt-3 leading-relaxed text-stone-600 dark:text-stone-300">
            Apply to have your shelter or NGO listed. Applications are reviewed
            before an organization appears on Okoa Food.
          </p>
        </section>
      </div>
      <div className="mt-8 border border-stone-200 bg-white p-8 dark:border-stone-800 dark:bg-stone-900 lg:p-12">
        <h2 className="text-xl font-bold">What happens next</h2>
        <p className="mt-3 leading-relaxed text-stone-600 dark:text-stone-300">
          An approved organization can reserve an available donation. The donor
          confirms handoff, then the organization confirms receipt. A pickup
          reference keeps both sides on the same request, and notifications
          track each step. Organizations can also post in-kind needs for
          neighbors to pledge toward. Okoa Food does not process payments or
          arrange delivery.
        </p>
        <Link to="/donations" className={`${primaryClass} mt-6`}>
          Browse donations
        </Link>
      </div>
    </div>
  );
}
