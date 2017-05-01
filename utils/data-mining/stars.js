module.exports = function(raw){
    function _byTopKey(obj, key){
        return Object
            .keys(obj[key])
            .map(id => obj[key][id]);
    }

    function _toArray(sth){
        if(sth === null || sth === undefined)
            return [];

        let sthArr = sth;

        if(!Array.isArray(sth))
            sthArr = [ sth ];

        return sthArr;
    }

    let data = {
        stars: {},
        starsRadius: 0,
        planets: {},
        empires: {}
    };

    let planetToStar = {};

    _byTopKey(raw, "galactic_object")
        .forEach(o => {
            let planets = _toArray(o['planet']);

            let star = {
                cords: {
                    x: -o['coordinate']['x'],
                    y: -o['coordinate']['y']
                },
                type: o['type'],
                name: o['name'],
                planets: planets.map(pId => `${pId}`)
            };

            const distance = Math.sqrt(Math.pow(star.cords.x, 2) + Math.pow(star.cords.y, 2));

            if(distance > data.starsRadius)
                data.starsRadius = Math.ceil(distance);

            planets
                .forEach(planetId => {
                    planetToStar[planetId] = o.name;
                });

            data.stars[o['name']] = star;
        });

    Object
        .keys(raw["planet"])
        .forEach(i => {
            const o = raw["planet"][i];

            let planet = {
                colonized: false
            };

            if(o['pop'] !== undefined){
                planet.colonized = true;
                planet.populationCount = o['pop'].length;
            }

            _toArray(o['timed_modifier']).forEach(modifier => {
                if(modifier['modifier'] === 'capital')
                    planet.capital = true;
            });

            data.planets[i] = planet;
        });

    Object
        .keys(raw["country"])
        .forEach(i => {
            const o = raw["country"][i];

            if(o["type"] === undefined)
                return;

            let empire = {
                id: `${i}`,
                name: o["name"],
                type: o["type"],
                colors: o["flag"] !== undefined ? o["flag"].colors : undefined
            };

            if(o.type !== "primitive" && o["controlled_planets"] !== undefined) {
                o["controlled_planets"].forEach(planetId => {
                    data.planets[planetId].controlledBy = i;

                    if(data.planets[planetId].capital){
                        empire.capital = {
                            planet: `${planetId}`,
                            star: planetToStar[planetId]
                        }
                    }
                });
            }

            data.empires[i] = empire;
        });

    data.stars = Object
        .keys(data.stars)
        .map(i => {
            let star = data.stars[i];

            // find who is in control of system - eq. who is in control of planets in system
            star.influencedBy = star.planets
                // map with controlled planets by empires
                .map(planetId => data.planets[planetId])
                .filter(planet => !!planet.controlledBy)
                .filter(planet => { return { controlledBy: planet.controlledBy, populationCount: planet.populationCount }; })
                // remove duplicates: TODO: ???
                .sort((a, b) => b.populationCount - a.populationCount)
                .filter((item, pos, ary) => !pos || item.controlledBy != ary[pos - 1].controlledBy);

            return star;
        })
        .reduce((prev, curr) => {
            prev[curr.name] = curr;
            return prev;
        }, {});

    return data;
};
