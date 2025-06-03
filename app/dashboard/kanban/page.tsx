import {
  ArrowLeftFromLineIcon,
  ArrowRightFromLineIcon,
  Binoculars,
  LayoutList,
} from "lucide-react";
import React from "react";
import Overview from "./Overview";

export default function Kanban() {
  return (
    <div className="p-10">
      <header>
        <h1 className="text-3xl font-semibold">Kanban Sparepert</h1>
      </header>
      {/* name of each tab group should be unique */}
      <div className="tabs tabs-lift mt-5">
        <label className="tab">
          <input type="radio" name="my_tabs_4" />
          <ArrowRightFromLineIcon className="w-4 h-4 mr-2" />
          Internal
        </label>
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <Overview />
        </div>

        <label className="tab">
          <input type="radio" name="my_tabs_4" defaultChecked />
          <ArrowLeftFromLineIcon className="w-4 h-4 mr-2" />
          Eksternal
        </label>
        <div className="tab-content bg-base-100 border-base-300 p-6">
          Tab content 2
        </div>

        <label className="tab">
          <input type="radio" name="my_tabs_4" />
          <LayoutList className="w-4 h-4 mr-2" />
          List Pembelian
        </label>
        <div className="tab-content bg-base-100 border-base-300 p-6">
          Tab content 3
        </div>

        <label className="tab">
          <input type="radio" name="my_tabs_4" />
          <Binoculars className="w-4 h-4 mr-2" />
          Monitoring Progress Pemesanan
        </label>
        <div className="tab-content bg-base-100 border-base-300 p-6">
          Tab content 3
        </div>
      </div>
    </div>
  );
}
